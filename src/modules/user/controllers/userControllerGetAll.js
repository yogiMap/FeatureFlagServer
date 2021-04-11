import User from '../userModel';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';

const userGetAll = (req, res) => {
  const { userId } = req.userData;
  return User.aggregate([
    {
      $lookup: {
        from: 'groups',
        localField: 'groups',
        foreignField: '_id',
        as: 'groups',
      },
    },

    {
      $project: {
        name: { $ifNull: ['$name', '$email'] },
        email: '$email',
        about: '$about',
        goals: '$goals',
        phone: { $ifNull: ['$phone', ''] },
        roles: { $ifNull: ['$roles', []] },
        links: '$links',
        createdAt: {
          $ifNull: [
            '$createdAt',
            {
              $dateFromString: {
                dateString: '2017-01-01',
              },
            },
          ],
        },
        emailConfirmed: '$emailConfirmation.confirmed',
        phoneConfirmed: '$phoneConfirmation.confirmed',

        groups: {
          $map: {
            input: '$groups',
            as: 'groups',
            in: {
              _id: '$$groups._id',
              name: '$$groups.name',
            },
          },
        },

        codewarsAnalytics: {
          $arrayElemAt: ['$codewarsAnalytics', -1],
        },
      },
    },

    { $sort: { createdAt: 1 } },
  ])

    .then((doc) => {
      if (doc) {
        //
        analytics('USER_GET_ALL_SUCCESS', {
          user: userId,
          usersCount: get(doc, 'length', null),
        });

        res.status(200).json(message.success('Get all users. Success', doc));
      } else {
        const analyticsId = analytics('USER_GET_ALL_FAIL', {
          user: userId,
        });

        res.status(400).json(message.fail('Get all users. Fail', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_ALL_ERROR', {
        error,
        user: userId,
        controller: 'userGetAll',
      });

      res.status(400).json(message.fail('Get all users. Error', analyticsId));
    });
};

export default userGetAll;
