import mongoose from 'mongoose';
import Flag from '../Model';
import message from '../../utils/messages';

export default function createFlagQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const flag = new Flag({
    _id,
    ...values,
  });

  return flag
    .save()
    .then(() => {
      return message.success('Flag created', _id);
    })
    .catch((err) => {
      return message.fail('Flag create error', err);
    });
}
