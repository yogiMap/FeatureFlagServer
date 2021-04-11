import User from '../../userModel';
import message from '../../../utils/messages';
import analytics from '../../../analytics/controllers/analytics';
import { get } from 'lodash';
import { notifyAboutNewRole } from '../../helpers/notifyAboutNewRole';

// This controller confirms email.
// 1. It changes "emailConfirmation.confirmed: false" to "emailConfirmation.confirmed: true" in the DB
// 2. Also for the role "new" it changes this role to "businessOwner" and sends a notification about it to the email.

const userEmailConfirm = (req, res) => {
  const { userId, hash } = req.params;

  User.findById(userId)
    .select('+emailConfirmation.hash')
    .exec()
    .then((user) => {
      if (user) {
        if (user.emailConfirmation.hash === hash) {
          // Receiving data to send a notification
          const currentRoles = get(user, 'roles', []);
          const name = get(user, 'name', '');
          const phone = get(user, 'phone', '');
          const email = user.email;

          // It updates the user and sends a notification to the email
          setUserEmailConfirmed(req, res, userId, currentRoles, email, name, phone);
        } else {
          const reason = 'Invalid hash';
          //
          const analyticsId = analytics('USER_EMAIL_CONFIRM_FAIL', {
            req,
            user: userId,
            reason,
          });

          res.status(400).json(message.fail('Email not confirmed', analyticsId));
        }
      } else {
        const reason = 'User not found';
        //
        const analyticsId = analytics('USER_EMAIL_CONFIRM_FAIL', {
          reason,
          hash,
          req,
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_EMAIL_CONFIRM_ERROR', {
        error,
        req,
        hash: hash,
        controller: 'userEmailConfirm',
      });

      res.status(400).json(message.fail('Email not confirmed', analyticsId));
    });
};

export default userEmailConfirm;

function setUserEmailConfirmed(req, res, userId, currentRoles, email, name, phone) {
  let updateBody;

  const isUserWithRoleNew = currentRoles.length === 1 && currentRoles[0] === 'new';
  const newRoles = ['verified'];

  if (isUserWithRoleNew) {
    // For a user with the role "new", it is necessary to confirm email and update the role
    updateBody = {
      'emailConfirmation.confirmed': true,
      roles: newRoles,
    };
  } else {
    // For all other roles, it is necessary to confirm only email
    updateBody = {
      'emailConfirmation.confirmed': true,
    };
  }

  return User.updateOne({ _id: userId }, { $set: updateBody }, { runValidators: true })
    .exec()
    .then((user) => {
      if (user.n) {
        // Sending role change notification
        const silent = get(process, 'env.MAIL_SILENT', false) === 'true';

        if (!silent && isUserWithRoleNew) {
          notifyAboutNewRole({ currentRoles, newRoles, email, name, phone });
        }

        analytics('USER_EMAIL_CONFIRM_SUCCESS', {
          params: req.params,
          user: userId,
        });

        res.status(200).json(message.success('Email confirmed. Success'));
      } else {
        const reason = 'User not found';
        //
        const analyticsId = analytics('USER_EMAIL_CONFIRM_FAIL', {
          reason,
          req,
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_EMAIL_CONFIRM_ERROR', {
        error,
        req,
        controller: 'userEmailConfirm',
      });

      res.status(400).json(message.fail('Email not confirmed', analyticsId));
    });
}
