import Client from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const clientGetById = (req, res) => {
  const clientId = get(req, 'params.clientId');
  const userId = get(req, 'userData.userId');

  Client.findById(clientId)
    // подтягивает данные из соседних коллекций, аналог SQL JOIN
    // .populate({
    //   path: 'members',
    //   select: 'name links',
    // })
    // .populate({
    //   path: 'lectures',
    //   options: { sort: { date: -1 } },
    //   populate: { path: 'understood', select: 'name' },
    // })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('Get Client by id ok', doc));
      } else {
        res.status(404).json(message.fail('No client for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('CLIENT_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Client',
        user: userId,
        controller: 'clientGetById',
      });

      res.status(400).json(message.fail('Client get error', analyticsId));
    });
};

export default clientGetById;
