import message from '../utils/messages';
import User from '../user/userModel';
import roles from './roles';
import analytics from '../analytics/controllers/analytics';
import { get } from 'lodash';

const userCan = (userRoles, checkedPermission) => {
  for (let i = 0; i < userRoles.length; i += 1) {
    if (roles[userRoles[i]].includes(checkedPermission)) return true;
  }
  return false;
};

const userCheckPerm = (checkedPermission) => (req, res, next) => {
  const userId = get(req, 'userData.userId', null);

  User.findById(userId)
    .exec()
    .then((user) => {
      if (user) {
        const roles = get(user, 'roles', []);

        if (userCan(roles, checkedPermission)) {
          req.userData.roles = roles;
          req.userData.name = get(user, 'name');
          req.userData.timeZone = get(user, 'timeZone');
          req.userData.emailConfirmation = get(user, 'emailConfirmation');
          req.userData.phoneConfirmation = get(user, 'phoneConfirmation');
          req.userData.companyAccountId = get(user, 'companyAccount');
          next();
        } else {
          const reason = 'Permission denied';
          const analyticsId = analytics('USER_CHECK_PERMISSION_FAIL', {
            reason,
            roles,
            user: userId,
          });
          res.status(400).json(message.fail(reason, analyticsId));
        }
      } else {
        const reason = 'Current user not found';

        const analyticsId = analytics('USER_CHECK_PERMISSION_FAIL', {
          reason,
          user: userId,
          permission: 'userCheckPerm',
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_CHECK_PERMISSION_ERROR', {
        error,
        roles,
        user: userId,
        permission: 'userCheckPerm',
      });

      res.status(400).json(message.fail('Permission denied. Error', analyticsId));
    });
};

export default userCheckPerm;
