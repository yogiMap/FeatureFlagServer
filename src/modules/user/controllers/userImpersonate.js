import jwt from 'jsonwebtoken';
import { flattenDeep, get, uniq } from 'lodash';
import User from '../userModel';
import message from '../../utils/messages';
import roles from '../../permission/roles';
import analytics from '../../analytics/controllers/analytics';

const acl = (userRoles) => uniq(flattenDeep(userRoles.map((el) => roles[el])));

const userImpersonate = (req, res) => {
  const userId = get(req, 'body.userId');
  User.findById(userId)
    .select('+password')
    .exec()
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
            codewarsId: user.codewarsId,
          },
          process.env.JWT_KEY,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
        );

        user.password = null;

        analytics('USER_LOGIN_SUCCESS', {
          user: user._id,
        });

        return res.status(200).json({
          message: 'Auth success',
          token,
          user: user,
          acl: acl(user.roles),
          userId: user._id,
        });
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_LOGIN_ERROR', {
        userId,
        controller: 'userLogin',
        error,
      });

      res.status(400).json(message.fail('Auth failed. Error', analyticsId));
    });
};

export default userImpersonate;
