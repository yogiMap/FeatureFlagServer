import mongoose from 'mongoose';
//import Base from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';
import createBaseQuery from '../queries/create';

export default async function baseCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'userData.userId');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const description = get(req, 'body.description');

  const createBaseQueryResult = await createBaseQuery({
    _id,
    name,
    description,
    owner: userId,
  });

  if (createBaseQueryResult.success) {
    res.status(200).json(createBaseQueryResult);
  } else {
    const analyticsId = analytics('BASE_CREATE_ERROR', {
      error: createBaseQueryResult.payload,
      body: req.body,
      entity: 'Base',
      entityId: _id,
      user: userId,
      controller: 'baseCreate',
    });

    res.status(400).json(message.fail('Base create error', analyticsId));
  }
}
