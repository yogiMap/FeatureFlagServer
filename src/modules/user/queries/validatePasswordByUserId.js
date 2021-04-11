import User from '../userModel';
import message from '../../utils/messages';
import bcrypt from 'bcryptjs';
import analytics from '../../analytics/controllers/analytics';

const validatePasswordByUserIdQuery = (userId, password) => {
  return User.findOne({ _id: userId })
    .select('+password')
    .exec()
    .then((user) => {
      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword) return message.success('Old password is valid', '');
        else return message.fail('Old password is not valid', password);
      } else {
        return message.fail('User not found', userId);
      }
    })
    .catch((error) => {
      const analyticsId = analytics('UPDATE_PASSWORD_USER_ERROR', {
        error,
        controller: 'updatePasswordById',
      });
      return message.fail('Update password user error', analyticsId);
    });
};

export default validatePasswordByUserIdQuery;
