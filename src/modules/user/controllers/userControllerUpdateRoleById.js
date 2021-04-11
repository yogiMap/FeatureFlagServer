import User from '../userModel';
import message from '../../utils/messages';
import { get } from 'lodash';
import { notifyAboutNewRole } from '../helpers/notifyAboutNewRole';
import analytics from '../../analytics/controllers/analytics';

// This controller updates user roles. Therefore req.body must include all the necessary user roles.
const userUpdateRoleById = (req, res) => {
  const userId = get(req, 'params.userId', null);

  const newRoles = get(req, 'body.roles', [])
    .map(String)
    .filter((t) => t !== 'admin');
  if (newRoles.length) req.body.roles = newRoles;

  return User.findOneAndUpdate(
    { _id: userId },
    { $set: { roles: req.body.roles } },
    { runValidators: true },
  )
    .exec()
    .then((user) => {
      if (user) {
        const currentRoles = get(user, 'roles').map(String);
        const email = get(user, 'email');
        const name = get(user, 'name');
        const phone = get(user, 'phone');

        const silent = get(process, 'env.MAIL_SILENT', false) === 'true';

        if (!silent) {
          notifyAboutNewRole({ currentRoles, newRoles, email, name, phone });
        }

        //
        analytics('USER_UPDATE_BY_ID_SUCCESS', {
          user: userId,
          email,
          newRoles,
        });

        res.status(200).json(message.success('User updated'));
      } else {
        const reason = 'User not found';
        //
        analytics('USER_UPDATE_BY_ID_FAIL', {
          reason,
          user: userId,
          body: req.body,
        });

        res.status(400).json(message.fail(reason));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_UPDATE_BY_ID_ERROR', {
        error: error.message,
        body: req.body,
        controller: 'userUpdateRoleById',
      });

      res.status(400).json(message.fail('User update by id. Error', analyticsId));
    });
};

export default userUpdateRoleById;
