import Client from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const clientStats = async (req, res) => {
  const userId = get(req, 'userData.userId');
  try {
    const totalCount = await Client.countDocuments();

    const result = {
      totalCount,
      totalCountDouble: totalCount * 2,
      totalCountTriple: totalCount * 3,
      totalCountTen: totalCount * 10,
    };

    res.status(200).json(message.success('Client Stats ok', result));
  } catch (error) {
    const analyticsId = analytics('CLIENT_STATS_ERROR', {
      error,
      body: req.body,
      entity: 'Client',
      user: userId,
      controller: 'clientStats',
    });

    res.status(400).json(message.fail('Client Stats error', analyticsId));
  }
};

export default clientStats;
