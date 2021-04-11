import { uniq, flattenDeep } from 'lodash';
import User from '../userModel';
import message from '../../utils/messages';
import roles from '../../permission/roles';
import analytics from '../../analytics/controllers/analytics';

const acl = (userRoles) => uniq(flattenDeep(userRoles.map((el) => roles[el])));

const userGetAuthUser = (req, res) => {
  const { userId } = req.userData;

  User.findById(userId)
    .exec()
    .then((doc) => {
      if (doc) {
        analytics('USER_GET_AUTH_USER_SUCCESS', {
          user: userId,
        });

        res.status(200).json(
          message.success(
            'Auth ok',
            {
              ...doc._doc,
              acl: acl(doc.roles),
              // dayReportExpired: true,
            },
            true,
          ),
        );
      } else {
        const reason = 'No user for provided id';

        const analyticsId = analytics('USER_GET_AUTH_USER_FAIL', {
          user: userId,
          reason,
        });

        res.status(404).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_AUTH_USER_ERROR', {
        error,
        user: userId,
        controller: 'userGetAuthUser',
        req,
      });

      res.status(400).json(message.fail('User auth error', analyticsId));
    });
};

export default userGetAuthUser;
