import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../userModel';
import message from '../../utils/messages';
import { sendMailCreatedUser } from '../helpers/sendMailCreatedUser';
import analytics from '../../analytics/controllers/analytics';
import { get } from 'lodash';
import { checkPassword } from './utils';

const userRegister = async (req, res) => {

  const firstName = get(req, 'body.firstName', '').trim();
  const lastName = get(req, 'body.lastName', '').trim();
  const email = get(req, 'body.email', '').trim().toLowerCase();
  const password = get(req, 'body.password', '');

  if (!checkPassword(password)) {
    const reason = 'Wrong password format';

    analytics('USER_REGISTER_FAIL', {
      reason: reason,
      email,
      firstName,
      lastName,
    });

    return res.status(400).json(message.fail(reason));
  }

  if (email.includes(' ')) {
    return res.status(400).json(message.fail('Incorrect email format'));
  }

  const isUserExists = await checkIsUserExist(email);

  if (isUserExists) {
    const analyticsId = analytics('USER_REGISTER_FAIL', {
      reason: 'Mail exists',
      email,
      firstName,
      lastName,
    });

    return res
      .status(409)
      .json(message.fail('User with this e-mail exists', analyticsId));
  }

  const createdUser = await createUser({
    email,
    password,
    firstName,
    lastName,
  });

  if (createdUser.success) {
    //
    analytics('USER_REGISTER_SUCCESS', {
      email,
      firstName,
      lastName,
    });

    return res
      .status(201)
      .json(
        message.success(
          'User created successfully. Please check your email and verify it',
        ),
      );
  } else {
    const analyticsId = analytics('USER_REGISTER_FAIL', {
      reason: get(createdUser, 'payload.message'),
      email,
      firstName,
      lastName,
    });

    return res.status(404).json(message.fail('User was not created', analyticsId));
  }
};

export default userRegister;

function checkIsUserExist(email) {
  return User.findOne({ email: email })
    .exec()
    .then((doc) => !!doc)
    .catch(() => false);
}

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

async function createUser({ email, password, firstName, lastName }) {
  const userId = new mongoose.Types.ObjectId();
  const emailHashConfirmation = new mongoose.Types.ObjectId();

  const user = new User({
    _id: userId,
    email,
    emailConfirmation: {
      hash: emailHashConfirmation,
      confirmed: false,
    },
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    password: hashPassword(password),
    roles: ['new'],
    timeZone: 'America/Los_Angeles',
  });

  return user
    .save()
    .then(() => {
      sendMailCreatedUser({
        email,
        emailHashConfirmation,
        firstName,
        lastName,
        userId,
      }).catch((error) => {
        //
        analytics('USER_REGISTER_ERROR', {
          email,
          firstName,
          lastName,
        });

        throw new Error(error);
      });
      return message.success('User created successfully', userId, false);
    })
    .catch((error) => {
      if (error.code === 11000) return message.fail('User with entered email exist');
      return message.fail('Error', error);
    });
}
