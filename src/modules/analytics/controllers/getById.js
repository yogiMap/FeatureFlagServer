import Analytics from '../Model';

const getById = (req, res) => {
  const { analyticsId } = req.params;
  Analytics.findById(analyticsId)
    .populate({
      path: 'user',
      select: 'name',
    })
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json('No analytics for provided id');
      }
    })
    .catch((err) => {
      res.status(400).json('Analytics error', err);
    });
};

export default getById;
