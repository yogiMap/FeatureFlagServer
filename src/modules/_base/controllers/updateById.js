import Base from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

export default async function baseUpdateById(req, res) {
  const baseId = get(req, 'params.baseId');
  const userId = get(req, 'userData.userId');

  Base.updateOne({ _id: baseId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Base updated'));
      } else {
        res.status(400).json(message.fail('Base not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('BASE_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Base',
        entityId: baseId,
        user: userId,
        controller: 'baseUpdateById',
      });

      res.status(400).json(message.fail('Base update error', analyticsId));
    });
}
