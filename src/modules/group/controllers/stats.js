import Group from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const groupStats = async (req, res) => {
  const userId = get(req, 'userData.userId');
  try {
    const totalCount = await Group.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Group Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('GROUP_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Group',
      user: userId,
      controller: 'groupStats',
    });

    res.status(400).json(message.fail('Group Stats error', analyticsId));
  }
};

export default groupStats;
