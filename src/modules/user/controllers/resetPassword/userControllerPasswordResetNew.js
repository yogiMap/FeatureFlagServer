import bcrypt from 'bcryptjs';
import User from '../../userModel';
import message from '../../../utils/messages';
import { isHashValid as _isHashValid } from './isHashValid';
import analytics from '../../../analytics/controllers/analytics';
import { get } from 'lodash';

import { checkPassword, validateObjectId } from './../utils';
import sendEmailViaAwsSes from '../../../mail/sesClient';

const emailTemplate = () => {
  const host = process.env.CLIENT_HOST;
  const link = `${host}/user/login`;
  return {
    html: `Your password has been changed <br/>
          Use <a href=${link}>${link}</a> to login<br/><br/>
          Thanks,<br/>
          Your friends at ClientBase`,
    text: `Your password has been changed\nUse the link ${link} to login\n\nThanks,\nYour friends at ClientBase`,
  };
};

const userPasswordResetNew = async (req, res) => {
  const { userId, password } = req.body;
  const hash = get(req, 'body.hash', '').trim();

  if (!checkPassword(password)) {
    const reason = 'Wrong password format';

    const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
      reason: reason,
      userId,
      hash,
    });

    return res.status(400).json(message.fail(reason, analyticsId));
  }

  if (!validateObjectId(hash)) {
    const reason = 'Wrong hash format';

    const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
      reason: reason,
      userId,
      hash,
    });

    return res.status(400).json(message.fail(reason, analyticsId));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const getUserResult = await getUserById(userId);

  if (getUserResult.success) {
    const user = getUserResult.payload;
    const isHashValid = _isHashValid(user, hash);

    if (isHashValid) {
      const updateHashResult = await updateHash({ userId, hashedPassword });

      if (updateHashResult.success) {
        const subject = '[ClientBase] Your password has been changed';
        await sendEmailViaAwsSes(user.email, subject, emailTemplate());

        analytics('USER_PASSWORD_CHANGE_SUCCESS', {
          user: userId,
          hash,
        });

        return res
          .status(200)
          .json(
            message.success('Your password has been changed successfully', '', false),
          );
      } else {
        const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
          reason: {
            updateHashResult: updateHashResult.payload,
            isHashValid,
          },
          user: userId,
          hash,
        });

        return res.status(400).json(message.fail('Invalid link', analyticsId));
      }
    } else {
      const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
        reason: {
          isHashValid,
        },
        user: userId,
        hash,
      });

      return res.status(400).json(message.fail('Invalid link', analyticsId));
    }
  } else {
    const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
      reason: getUserResult.payload,
      hash,
    });

    return res.status(400).json(message.fail('Change password error', analyticsId));
  }
};

function getUserById(userId) {
  return User.findOne({ _id: userId })
    .select('+resetPassword.hash +resetPassword.date')
    .exec()
    .then((user) => {
      if (user) {
        return message.success('User', user);
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_PASSWORD_CHANGE_ERROR', {
        error,
        controller: 'getUserById',
      });

      return message.fail('Get User error', analyticsId);
    });
}

function updateHash({ userId, hashedPassword }) {
  return User.updateOne(
    { _id: userId },
    {
      $set: {
        password: hashedPassword,
        'resetPassword.hash': '',
        'resetPassword.date': Date.now(),
      },
      $push: { 'resetPassword.history': { date: new Date() } },
    },
    { runValidators: true },
  )
    .exec()
    .then((user) => {
      if (user) {
        return message.success('Hash updated');
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_PASSWORD_CHANGE_ERROR', {
        error,
        user: userId,
        controller: 'updateHash',
      });

      return message.fail('Get User error', analyticsId);
    });
}

export default userPasswordResetNew;
