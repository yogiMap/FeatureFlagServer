import Flag from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const flagDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.flagId');

  // Получаем id текущего пользователя
  const userId = get(req, 'userData.userId');

  Flag.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Flag deleted'));
      } else {
        res.status(400).json(message.fail('Flag not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('FLAG_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Flag',
        entityId: _id,
        user: userId,
        controller: 'flagCreate',
      });

      res.status(400).json(message.fail('Flag delete error', analyticsId));
    });
};

export default flagDeleteById;
