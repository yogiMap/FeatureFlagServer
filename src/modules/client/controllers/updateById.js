import Client from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

export default async function clientUpdateById(req, res) {
  const clientId = get(req, 'params.clientId');
  const userId = get(req, 'userData.userId');

  Client.updateOne({ _id: clientId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Client updated'));
      } else {
        res.status(400).json(message.fail('Client not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('CLIENT_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Client',
        entityId: clientId,
        user: userId,
        controller: 'clientUpdateById',
      });

      res.status(400).json(message.fail('Client update error', analyticsId));
    });
}
