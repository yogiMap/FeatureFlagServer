import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../index';
import { testUser, idOfNonexistentUser, wrongFormatUserId } from '../_data';
import { expiredToken, roles } from '../../../_test/data';
import { token } from '../../../_test/helpers';
import { userRegisterAction, userLoginAction } from '../_actions';
import User from '../../userModel';

let userId = null;
let userToken = null;
const userVerifyEmailSendRoute = '/user/verify/email/send';
const rolesWithoutAdmin = roles.filter((role) => role !== 'admin');

// These tests run in the mode "MAIL_SILENT = true"
describe('USER VERIFY EMAIL SEND', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should login user, get user id and token', (done) => {
    userLoginAction({ email: testUser.email, password: testUser.password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        userId = res.body.userId;
        userToken = res.body.token;
        if (err) return done(err);
        done();
      });
  });

  it('should check that user can send a confirmation email to himself', (done) => {
    request(app)
      .post(userVerifyEmailSendRoute)
      .send({ userId })
      .set('Accept', 'application/json')
      .set('Authorization', userToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should check that admin can send a confirmation email to user', (done) => {
    request(app)
      .post(userVerifyEmailSendRoute)
      .send({ userId })
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  for (let i = 0; i < rolesWithoutAdmin.length; i++) {
    it(`should check that user with role ${rolesWithoutAdmin[i]} can NOT send a confirmation email to user`, (done) => {
      request(app)
        .post(userVerifyEmailSendRoute)
        .send({ userId })
        .set('Accept', 'application/json')
        .set('Authorization', token(rolesWithoutAdmin[i]))
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.success).false;
          done();
        });
    });
  }

  it('should check that admin can NOT send a confirmation email to nonexistent user', (done) => {
    request(app)
      .post(userVerifyEmailSendRoute)
      .send({ userId: idOfNonexistentUser })
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT send confirmation email with the wrong format user id', (done) => {
    request(app)
      .post(userVerifyEmailSendRoute)
      .send({ userId: wrongFormatUserId })
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT send confirmation email without token', (done) => {
    request(app)
      .post(userVerifyEmailSendRoute)
      .send({ userId })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT send confirmation email with expired token', (done) => {
    request(app)
      .post(userVerifyEmailSendRoute)
      .send({ userId })
      .set('Accept', 'application/json')
      .set('Authorization', expiredToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should set `emailConfirmation.confirmed: true` in the DB as predefined step for the next test', (done) => {
    User.updateOne({ _id: userId }, { $set: { emailConfirmation: { confirmed: true } } })
      .then((res) => {
        expect(res.n).eq(1);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should NOT send confirmation email when it`s already confirmed in the DB', (done) => {
    request(app)
      .post(userVerifyEmailSendRoute)
      .send({ userId })
      .set('Accept', 'application/json')
      .set('Authorization', userToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
