import Group from '../Model';
import message from '../../utils/messages';

const groupGetByIdQuery = (groupId) => {
  return Group.findById(groupId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Group get by id OK', doc);
      } else {
        return message.fail('No Group for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Group by id ERROR', err);
    });
};

export default groupGetByIdQuery;
