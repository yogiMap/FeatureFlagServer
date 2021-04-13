import mongoose from 'mongoose';
//import Group from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';
import createGroupQuery from '../queries/create';

export default async function groupCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'userData.userId');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const description = get(req, 'body.description');
  const flag = get(req, 'body.flag');

  const createGroupQueryResult = await createGroupQuery({
    _id,
    name,
    description,
    flag,
    owner: userId,
  });

  if (createGroupQueryResult.success) {
    res.status(200).json(createGroupQueryResult);
  } else {
    const analyticsId = analytics('GROUP_CREATE_ERROR', {
      error: createGroupQueryResult.payload,
      body: req.body,
      entity: 'Group',
      entityId: _id,
      user: userId,
      controller: 'groupCreate',
    });

    res.status(400).json(message.fail('Group create error', analyticsId));
  }
}
