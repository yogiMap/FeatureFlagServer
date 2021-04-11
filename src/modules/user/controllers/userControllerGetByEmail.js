import User from '../userModel';
import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';

const userGetByEmail = (req, res) => {
  const { email } = req.params;

  User.aggregate([
    {
      $match: {
        email,
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
  ])
    .then((doc) => {
      if (doc) {
        res.status(200).json(message.success('User by email', doc[0]));
      } else {
        res.status(404).json(message.fail('No User for provided id'));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_BY_EMAIL_ERROR', {
        error,
        email,
        controller: 'userGetByEmail',
      });

      res.status(400).json(message.fail('User get by email. Error', analyticsId));
    });
};

export default userGetByEmail;
