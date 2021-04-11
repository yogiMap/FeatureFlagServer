import Group from '../Model';
import message from '../../utils/messages';

const groupUpdateByIdQuery = ({ groupId, values }) => {
  return Group.updateOne({ _id: groupId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Group updated');
      } else {
        return message.fail('Group not found');
      }
    })
    .catch((error) => {
      return message.fail('Group update error', error);
    });
};

export default groupUpdateByIdQuery;
