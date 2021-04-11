import Client from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const clientDeleteById = (req, res) => {
  // читаем id из параметров URL запроса
  const _id = get(req, 'params.clientId');

  // Получаем id текущего пользователя
  const userId = get(req, 'userData.userId');

  Client.deleteOne({ _id })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Client deleted'));
      } else {
        res.status(400).json(message.fail('Client not found'));
      }
    })
    .catch((error) => {
      // Формируем, записываем данные события для аналитики
      const analyticsId = analytics('CLIENT_DELETE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Client',
        entityId: _id,
        user: userId,
        controller: 'clientCreate',
      });

      res.status(400).json(message.fail('Client delete error', analyticsId));
    });
};

export default clientDeleteById;
