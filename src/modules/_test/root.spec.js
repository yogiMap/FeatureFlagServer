import mongoose from 'mongoose';
import { options, connectionString } from '../core/db';
import User from '../user/userModel';
import { password, user } from './data';
import request from 'supertest';
import app from '../../index';
import { expect } from 'chai';

let connection;
process.env.TOKEN_NEW = null;
process.env.TOKEN_ADMIN = null;

process.env.ID_ADMIN = null;

before(() => {
  console.log('-------- USER COLLECTION DROP ------------');
  return User.deleteMany({});
});

before(() => {
  console.log('-------- USER CREATE PREDEFINED ------------');
  mongoose.connect(connectionString, options).catch((err) => console.log(err));
  connection = mongoose.connection;
  connection
    .collection('users')
    .insertMany([user.admin, user.new])
    .catch((err) => {
      console.log(err);
      return err;
    });
});

after(() => {
  connection.close();
});

describe('Get tokens', () => {
  Object.keys(user).forEach((role) => {
    it(`should get ${role} token`, (done) => {
      request(app)
        .post('/user/login')
        .send({ email: user[`${role}`].email, password })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          process.env[`TOKEN_${role.toUpperCase()}`] = res.body.token;
          // all info about each user -> res.body.user
          // userId -> res.body.user._id
          process.env[`ID_${role.toUpperCase()}`] = res.body.user._id;
          expect(res.body.token).not.empty;
          expect(res.body.user._id).not.empty;
          done();
        });
    });
  });
});
