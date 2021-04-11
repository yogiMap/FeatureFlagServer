import message from '../utils/messages';
import faker from 'faker';
import Base from '../_base/Model';
import mongoose from 'mongoose';

export const service = (req, res) => {
  for (let i = 0; i < 200; i++) {
    const base = new Base({
      _id: new mongoose.Types.ObjectId(),
      name: faker.commerce.productName(),
      description: faker.lorem.paragraphs(1),
      owner: '5eae50fc12011e161e931cc3',
    });

    base
      .save()
      .then(() => {})
      .catch((error) => {
        console.log(error);
        console.log('=========================');
      });
  }

  res.status(200).json(message.success('Service'));
};
