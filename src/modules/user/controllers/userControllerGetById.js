import User from '../userModel';
import message from '../../utils/messages';
import mongoose from 'mongoose';
import analytics from '../../analytics/controllers/analytics';

const ObjectId = mongoose.Types.ObjectId;

const userGetById = (req, res, next) => {
  const userId = req.params.userId;

  User.aggregate([
    {
      $match: {
        _id: ObjectId(userId),
      },
    },

    {
      $project: {
        name: '$name',
        firstName: '$firstName',
        lastName: '$lastName',
        links: '$links',
        roles: '$roles',
      },
    },
    //---------
  ])
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('User found', doc[0]));
      } else {
        res.status(404).json(message.fail('No User for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_BY_ID_ERROR', {
        error,
        user: userId,
        controller: 'userGetById',
      });

      res.status(400).json(message.fail('User get by ID. Error', analyticsId));
    });
};

export default userGetById;
