import Base from '../Model';
import message from '../../utils/messages';

const baseUpdateByIdQuery = ({ baseId, values }) => {
  return Base.updateOne({ _id: baseId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Base updated');
      } else {
        return message.fail('Base not found');
      }
    })
    .catch((error) => {
      return message.fail('Base update error', error);
    });
};

export default baseUpdateByIdQuery;
