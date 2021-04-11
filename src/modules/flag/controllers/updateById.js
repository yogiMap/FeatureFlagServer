import Flag from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

export default async function flagUpdateById(req, res) {
  const flagId = get(req, 'params.flagId');
  const userId = get(req, 'userData.userId');

  Flag.updateOne({ _id: flagId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Flag updated'));
      } else {
        res.status(400).json(message.fail('Flag not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('FLAG_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Flag',
        entityId: flagId,
        user: userId,
        controller: 'flagUpdateById',
      });

      res.status(400).json(message.fail('Flag update error', analyticsId));
    });
}
