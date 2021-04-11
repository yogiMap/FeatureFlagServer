import message from '../../utils/messages';
import faker from 'faker';
import Base from '../../_base/Model';
import mongoose from 'mongoose';
import { get } from 'lodash';

export const fakeGeneratorBase = (req, res) => {
  const userId = get(req, 'userData.userId');
  const count = get(req, 'body.count', 100);
  const clientId = get(req, 'body.client', '5f69e2fd921b2805a8a4337f');

  for (let i = 0; i < count; i++) {
    const baseFields = {
      _id: new mongoose.Types.ObjectId(),
      owner: userId,
      client: clientId,
      description: faker.name.orderDescriptor(),
      name: faker.name.orderTitle(),
    };

    const base = new Base(baseFields);
    base
      .save()
      .then(() => {})
      .catch((error) => {
        console.log(error);
        console.log('=========================');
      });
  }
  res.status(200).json(message.success('Base have been created'));
};
