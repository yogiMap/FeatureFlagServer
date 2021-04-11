import Base from '../Model';
import message from '../../utils/messages';

const baseGetByIdQuery = (baseId) => {
  return Base.findById(baseId)
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Base get by id OK', doc);
      } else {
        return message.fail('No Base for provided id');
      }
    })
    .catch((err) => {
      return message.fail('Get Base by id ERROR', err);
    });
};

export default baseGetByIdQuery;
