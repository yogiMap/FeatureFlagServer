import Base from '../Model';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const baseGetById = (req, res) => {
  const baseId = get(req, 'params.baseId');
  const userId = get(req, 'userData.userId');

  Base.findById(baseId)
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
        res.status(200).json(message.success('Get Base by id ok', doc));
      } else {
        res.status(404).json(message.fail('No base for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('BASE_GET_BY_ID_ERROR', {
        error,
        body: req.body,
        entity: 'Base',
        user: userId,
        controller: 'baseGetById',
      });

      res.status(400).json(message.fail('Base get error', analyticsId));
    });
};

export default baseGetById;
