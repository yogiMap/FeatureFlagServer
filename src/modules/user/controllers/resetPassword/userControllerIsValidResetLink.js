import User from '../../userModel';
import message from '../../../utils/messages';
import { get } from 'lodash';
import { isHashValid } from './isHashValid';
import analytics from '../../../analytics/controllers/analytics';

const userPasswordIsValidResetLink = async (req, res) => {
  const { userId, hash } = req.body;

  User.findById(userId)
    .select('+resetPassword.hash +resetPassword.date')
    .exec()
    .then((doc) => {
      if (doc) {
        const user = get(doc, '_doc');

        if (isHashValid(user, hash)) {
          //
          analytics('USER_CHECK_RESET_LINK_SUCCESS', {
            body: req.body,
          });

          res.status(200).json(message.success('Valid link'));
        } else {
          const reason = 'User found. Invalid hash string';
          //
          const analyticsId = analytics('USER_CHECK_RESET_LINK_FAIL', {
            reason,
            body: req.body,
          });

          res.status(404).json(message.fail('Invalid link', analyticsId));
        }
      } else {
        const reason = 'User not found. Hash was not checked';

        const analyticsId = analytics('USER_CHECK_RESET_LINK_FAIL', {
          reason,
          body: req.body,
        });

        res.status(404).json(message.fail('Invalid link', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_CHECK_RESET_LINK_ERROR', {
        error,
        body: req.body,
        controller: 'userPasswordIsValidResetLink',
      });

      res.status(404).json(message.fail('Invalid link', analyticsId));
    });
};

export default userPasswordIsValidResetLink;
