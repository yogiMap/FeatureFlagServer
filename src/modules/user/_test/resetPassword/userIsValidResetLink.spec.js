import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../index';
import {
  testUser,
  wrongFormatUserId,
  idOfNonexistentUser,
  wrongFormatHash,
  invalidHash,
} from '../_data';
import { userRegisterAction, userPasswordResetRequestAction } from '../_actions';
import User from '../../userModel';

let userId = null;
let hash = null;
const userIsValidResetLinkRoute = '/user/password/reset/valid';

describe('USER IS VALID RESET LINK', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should send password reset request', (done) => {
    userPasswordResetRequestAction({ email: testUser.email }).expect(200, done);
  });

  before('should get user id and hash', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        userId = res._id;
        hash = res.resetPassword.hash;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('reset link is invalid with invalid hash', (done) => {
    request(app)
      .post(userIsValidResetLinkRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: invalidHash,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('reset link is invalid with the wrong hash format', (done) => {
    request(app)
      .post(userIsValidResetLinkRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: wrongFormatHash,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('reset link is invalid with the wrong format user id', (done) => {
    request(app)
      .post(userIsValidResetLinkRoute)
      .set('Accept', 'application/json')
      .send({
        userId: wrongFormatUserId,
        hash: hash,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('reset link is invalid with an id of nonexistent user', (done) => {
    request(app)
      .post(userIsValidResetLinkRoute)
      .set('Accept', 'application/json')
      .send({
        userId: idOfNonexistentUser,
        hash: hash,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('reset link is valid with correct user id and hash', (done) => {
    request(app)
      .post(userIsValidResetLinkRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: hash,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });
});
