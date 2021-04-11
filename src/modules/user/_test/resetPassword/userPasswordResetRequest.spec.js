import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../index';
import { testUser } from '../_data';
import { userRegisterAction } from '../_actions';
import User from '../../userModel';

const wrongEmail = 'wrongEmail@pasv.us';
const lengthHash = 24;
const userResetRequestRoute = '/user/password/reset/request';

describe('USER PASSWORD RESET REQUEST', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  it('password reset request should NOT be successful with wrong email', (done) => {
    request(app)
      .post(userResetRequestRoute)
      .set('Accept', 'application/json')
      .send({ email: wrongEmail })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should check that `resetPassword.hash` is undefined in DB', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        expect(res.resetPassword.hash).to.be.undefined;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('password reset request should NOT be successful without email', (done) => {
    request(app)
      .post(userResetRequestRoute)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should check that `resetPassword.hash` is undefined in DB', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        expect(res.resetPassword.hash).to.be.undefined;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('password reset request should be successful with correct email', (done) => {
    request(app)
      .post(userResetRequestRoute)
      .set('Accept', 'application/json')
      .send({ email: testUser.email })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should check that `resetPassword.hash` appeared in DB', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        expect(res.resetPassword.hash).to.be.a('string');
        expect(res.resetPassword.hash).to.have.lengthOf(lengthHash);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
