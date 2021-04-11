import message from '../utils/messages';
import analytics from '../analytics/controllers/analytics';
import { get } from 'lodash';

const userCheckEmailSendPerm = (req, res, next) => {
  const requestUserId = get(req, 'body.userId', '');

  const currentUserId = get(req, 'userData.userId', null);
  const currentUserRoles = get(req, 'userData.roles', []);

  if (currentUserId === requestUserId || currentUserRoles.includes('admin')) {
    next();
  } else {
    const analyticsId = analytics('USER_CHECK_EMAIL_SEND_PERM_FAIL', {
      body: req.body,
      user: currentUserId,
      currentUserRoles,
      permission: 'userCheckEmailSendPerm',
    });

    return res
      .status(400)
      .json(message.fail('User check email send permission. Fail', analyticsId));
  }
};

export default userCheckEmailSendPerm;
