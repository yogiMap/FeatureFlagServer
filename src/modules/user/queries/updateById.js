import User from '../userModel';
import message from '../../utils/messages';

const userUpdateByIdQuery = ({ userId, values }) => {
  return User.updateOne({ _id: userId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('User updated');
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      return message.fail('User update error', error);
    });
};

export default userUpdateByIdQuery;
