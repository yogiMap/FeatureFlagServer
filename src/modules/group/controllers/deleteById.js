import Group from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const groupDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.groupId');

  // Получаем id текущего пользователя
  const userId = get(req, 'userData.userId');

  Group.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Group deleted'));
      } else {
        res.status(400).json(message.fail('Group not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('GROUP_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Group',
        entityId: _id,
        user: userId,
        controller: 'groupCreate',
      });

      res.status(400).json(message.fail('Group delete error', analyticsId));
    });
};

export default groupDeleteById;
