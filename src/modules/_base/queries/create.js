import mongoose from 'mongoose';
import Base from '../Model';
import message from '../../utils/messages';

export default function createBaseQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const base = new Base({
    _id,
    ...values,
  });

  return base
    .save()
    .then(() => {
      return message.success('Base created', _id);
    })
    .catch((err) => {
      return message.fail('Base create error', err);
    });
}
