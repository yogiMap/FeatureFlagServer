import mongoose from 'mongoose';
import Client from '../Model';
import message from '../../utils/messages';

export default function createClientQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const client = new Client({
    _id,
    ...values,
  });

  return client
    .save()
    .then(() => {
      return message.success('Client created', _id);
    })
    .catch((err) => {
      return message.fail('Client create error', err);
    });
}
