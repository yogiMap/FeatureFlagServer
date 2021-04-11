import Group from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

export default async function groupUpdateById(req, res) {
  const groupId = get(req, 'params.groupId');
  const userId = get(req, 'userData.userId');

  Group.updateOne({ _id: groupId }, { $set: req.body }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        res.status(200).json(message.success('Group updated'));
      } else {
        res.status(400).json(message.fail('Group not found'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('GROUP_UPDATE_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Group',
        entityId: groupId,
        user: userId,
        controller: 'groupUpdateById',
      });

      res.status(400).json(message.fail('Group update error', analyticsId));
    });
}
