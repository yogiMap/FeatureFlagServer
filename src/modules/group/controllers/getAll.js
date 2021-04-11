import Group from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

// Такие контроллеры нельзя давать всем.
// Использовать только на начальных этапах
// так как ответ может быть слишком большим

const groupGetAll = (req, res) => {
  // Получаем id текущего пользователя
  const userId = get(req, 'userData.userId');

  // Найти все
  Group.find()
    .sort({ createdAt: -1 })
    // .select('name') // если нужно получить отдельные поля
    .exec()
    .then((docs) => {
      res.status(200).json(message.success('Get all groups ok', docs));
    })
    .catch((error) => {
      const analyticsId = analytics('GROUP_GET_ALL_ERROR', {
        error,
        body: req.body,
        entity: 'Group',
        user: userId,
        controller: 'groupGetAll',
      });

      res.status(400).json(message.fail('Group get all error', analyticsId));
    });
};

export default groupGetAll;
