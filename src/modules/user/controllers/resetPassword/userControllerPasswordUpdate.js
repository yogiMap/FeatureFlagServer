import bcrypt from 'bcryptjs';
import message from '../../../utils/messages';

import { get } from 'lodash';
import validatePasswordByUserIdQuery from '../../queries/validatePasswordByUserId';
import updateUserPasswordByIdQuery from '../../queries/updateUserPasswordById';
import analytics from '../../../analytics/controllers/analytics';

export default async function userPasswordUpdate(req, res) {
  const userId = get(req, 'userData.userId');
  const password = get(req, 'body.password');
  const newPassword = get(req, 'body.newPassword');

  const hashPassword = (newPassword) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(newPassword, salt);
  };

  const encryptedNewPassword = hashPassword(newPassword);

  const validatePasswordByUserIdQueryResult = await validatePasswordByUserIdQuery(
    userId,
    password,
  );
  if (validatePasswordByUserIdQueryResult.success) {
    const updateUserPasswordByIdQueryResult = await updateUserPasswordByIdQuery({
      userId,
      encryptedNewPassword,
    });
    if (updateUserPasswordByIdQueryResult.success) {
      res.status(200).json(message.success('PASSWORD UPDATED', '', false));
    } else {
      res.status(400).json(message.fail('UPDATE PASSWORD FAIL', ''));
    }
  } else {
    const analyticsId = analytics('USER_OLD_PASSWORD_VALIDATE_BY_ID_FAIL', {
      reason: validatePasswordByUserIdQueryResult,
      body: req.body,
      entity: 'User',
      user: userId,
      controller: 'updateUserPasswordById',
    });

    res.status(400).json(message.fail('WRONG OLD PASSWORD', analyticsId));
  }
}
