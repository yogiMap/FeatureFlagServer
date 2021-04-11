import Flag from '../Model';
import message from '../../utils/messages';

const flagUpdateByIdQuery = ({ flagId, values }) => {
  return Flag.updateOne({ _id: flagId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Flag updated');
      } else {
        return message.fail('Flag not found');
      }
    })
    .catch((error) => {
      return message.fail('Flag update error', error);
    });
};

export default flagUpdateByIdQuery;
