import mongoose from 'mongoose';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';
import createFlagQuery from '../queries/create';
import addFlagToGroupQuery from '../queries/addFlagToGroup';
import Flag from '../Model';
import escapeRegExp from '../../utils/escapeRegExp';

export default async function flagCreate(req, res) {
  // Создаем id материала который будет создан
  const _id = new mongoose.Types.ObjectId();

  // Получаем id текущего пользователя
  const userId = get(req, 'userData.userId');

  // Читаем данные из запроса
  const name = get(req, 'body.name');
  const value = get(req, 'body.value');
  const description = get(req, 'body.description');
  const groupId = get(req, 'body.groupId');

  const isFlagExist = await Flag.count({ name: { $eq: escapeRegExp(name) } });

  if (isFlagExist) {
    return res.status(400).json(message.fail('Flag exist'));
  }

  const createFlagQueryResult = await createFlagQuery({
    _id,
    name,
    value,
    description,
    group: groupId,
    owner: userId,
  });

  const addFlagToGroupResult = await addFlagToGroupQuery({
    flagId: _id,
    groupId,
  });

  console.log(addFlagToGroupResult, createFlagQueryResult);

  if (createFlagQueryResult.success && addFlagToGroupResult.success) {
    res.status(200).json(createFlagQueryResult);
  } else {
    const analyticsId = analytics('FLAG_CREATE_ERROR', {
      error: createFlagQueryResult.payload,
      body: req.body,
      entity: 'Flag',
      entityId: _id,
      user: userId,
      controller: 'flagCreate',
    });

    res.status(400).json(message.fail('Flag create error', analyticsId));
  }
}
