import Group from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const groupGetById = (req, res) => {
  const groupId = get(req, 'params.groupId');
  const userId = get(req, 'userData.userId');

  Group.findById(groupId)
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    .populate({
      path: 'flag',
      select: 'name value',
    })
    // .populate({
    //   path: 'lectures',
    //   options: { sort: { date: -1 } },
    //   populate: { path: 'understood', select: 'name' },
    // })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('Get Group by id ok', doc));
      } else {
        res.status(404).json(message.fail('No group for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('GROUP_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Group',
        user: userId,
        controller: 'groupGetById',
      });

      res.status(400).json(message.fail('Group get error', analyticsId));
    });
};

export default groupGetById;
