import Flag from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const flagGetById = (req, res) => {
  const flagId = get(req, 'params.flagId');
  const userId = get(req, 'userData.userId');

  Flag.findById(flagId)
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
        res.status(200).json(message.success('Get Flag by id ok', doc));
      } else {
        res.status(404).json(message.fail('No flag for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('FLAG_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Flag',
        user: userId,
        controller: 'flagGetById',
      });

      res.status(400).json(message.fail('Flag get error', analyticsId));
    });
};

export default flagGetById;
