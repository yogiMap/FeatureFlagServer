import User from '../../userModel';
import message from '../../../utils/messages';
import mongoose from 'mongoose';
import { get } from 'lodash';
import analytics from '../../../analytics/controllers/analytics';
import sendEmailViaAwsSes from '../../../mail/sesClient';

const emailTemplate = (host, hash, userId) => {
  const link = `${host}/user/password/reset/${userId}/${hash}`;
  console.log('===============');
  console.log('RESET LINK', link);
  console.log('===============');
  return {
    html: `You can use the following link to reset your password: <br/>
          <a href=${link}>${link}</a><br/>
          Link is valid only 3 hours.<br/><br/>
          Thanks,<br/>
          Your friends at Feature-Flag`,
    text: `You can use the following link to reset your password:\n${link}\nLink is valid only 3 hours.\n\nThanks,\nYour friends at Feature-Flag`,
  };
};

const userPasswordResetRequest = async (req, res) => {
  const hash = new mongoose.Types.ObjectId().toString();
  const subject = '[Feature-Flag] Reset password';
  const host = process.env.CLIENT_HOST;

  const email = get(req, 'body.email', '').trim().toLowerCase();

  const userUpdateAddHash = await updateUser(email, hash);

  if (userUpdateAddHash.success && userUpdateAddHash.payload) {
    const userId = userUpdateAddHash.payload;
    const mail = await sendEmailViaAwsSes(
      email,
      subject,
      emailTemplate(host, hash, userId),
    );

    if (mail.success) {
      //
      analytics('USER_PASSWORD_RESET_REQUEST_SUCCESS', {
        userId,
        email,
        hash,
      });

      res.status(200).json(message.success('Check mail for reset password link'));
    } else {
      const reason = 'Mail sender error';
      const analyticsId = analytics('USER_PASSWORD_RESET_REQUEST_FAIL', {
        reason: { message: 'Mail sender error', error: mail.payload },
        userId,
        email,
        hash,
      });

      res.status(400).json(message.fail(reason, analyticsId));
    }
  } else {
    const analyticsId = analytics('USER_PASSWORD_RESET_REQUEST_FAIL', {
      reason: userUpdateAddHash.payload,
      email,
      hash,
    });

    res.status(400).json(message.fail('User not found', analyticsId));
  }
};

function updateUser(email, hash) {
  return User.findOneAndUpdate(
    { email },
    {
      $set: {
        'resetPassword.hash': hash,
        'resetPassword.date': Date.now(),
      },
    },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Save hash in User. Success.', doc._id.toString());
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_PASSWORD_RESET_REQUEST_ERROR', {
        error,
        email,
        hash,
        controller: 'updateUser',
      });
      return message.fail('User update error', analyticsId);
    });
}

export default userPasswordResetRequest;
