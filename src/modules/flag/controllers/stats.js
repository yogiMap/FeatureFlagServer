import Flag from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const flagStats = async (req, res) => {
  const userId = get(req, 'userData.userId');
  try {
    const totalCount = await Flag.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Flag Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('FLAG_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Flag',
      user: userId,
      controller: 'flagStats',
    });

    res.status(400).json(message.fail('Flag Stats error', analyticsId));
  }
};

export default flagStats;
