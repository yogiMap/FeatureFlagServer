import User from '../userModel';
import message from '../../utils/messages';
import { get } from 'lodash';
import analytics from '../../analytics/controllers/analytics';
import userProfileFieldsMapping from '../helpers/userProfileFieldsMapping';

const userUpdateSelf = (req, res) => {
  const { userId } = req.userData;

  const user = userProfileFieldsMapping(req.body);

  const isEmailConfirmed = get(req, 'userData.emailConfirmation.confirmed', false);
  const isPhoneConfirmed = get(req, 'userData.phoneConfirmation.confirmed', false);

  // if confirmed do not update
  if (isEmailConfirmed) delete user.email;
  if (isPhoneConfirmed) delete user.phone;

  User.updateOne({ _id: userId }, { $set: user }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        analytics('USER_UPDATE_SELF_SUCCESS', {
          user: userId,
          body: req.body,
        });

        res.status(200).json(message.success('User updated'));
      } else {
        const reason = 'User not found';
        analytics('USER_UPDATE_SELF_FAIL', {
          reason,
          user: userId,
        });

        res.status(404).json(message.fail(reason));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_UPDATE_SELF_ERROR', {
        error,
        user: userId,
        body: req.body,
      });

      res.status(400).json(message.fail('User update error', analyticsId));
    });
};

export default userUpdateSelf;
