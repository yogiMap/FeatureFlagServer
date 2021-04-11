import Flag from '../Model';
import message from '../../utils/messages';

const flagGetByIdQuery = (flagId) => {
  return Flag.findById(flagId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Flag get by id OK', doc);
      } else {
        return message.fail('No Flag for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Flag by id ERROR', err);
    });
};

export default flagGetByIdQuery;
