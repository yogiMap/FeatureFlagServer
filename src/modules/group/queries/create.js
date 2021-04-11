import mongoose from 'mongoose';
import Group from '../Model';
import message from '../../utils/messages';

export default function createGroupQuery(values) {
  const _id = values._id || new mongoose.Types.ObjectId();

  const group = new Group({
    _id,
    ...values,
  });

  return group
    .save()
    .then(() => {
      return message.success('Group created', _id);
    })
    .catch((err) => {
      return message.fail('Group create error', err);
    });
}
