import Base from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const baseStats = async (req, res) => {
  const userId = get(req, 'userData.userId');
  try {
    const totalCount = await Base.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Base Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('BASE_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Base',
      user: userId,
      controller: 'baseStats',
    });

    res.status(400).json(message.fail('Base Stats error', analyticsId));
  }
};

export default baseStats;
