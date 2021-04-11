import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../index';
import { testUser } from '../_data';
import { userPasswordResetRequestAction, userRegisterAction } from '../_actions';
import User from '../../userModel';
import { roles, expiredToken } from '../../../_test/data';
import { roleHasPermission, token } from '../../../_test/helpers';

let userId = null;
let hash = null;
let userGetResetPasswordHashRoute = null;

describe('USER GET RESET PASSWORD HASH', () => {
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
        userGetResetPasswordHashRoute = `/user/hash/${userId}`;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.update.any')) {
      it(`should get reset password hash with role ${role}`, (done) => {
        request(app)
          .get(userGetResetPasswordHashRoute)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            expect(res.body.payload.hash).eq(hash);
            done();
          });
      });
    } else {
      it(`should NOT get reset password hash with role ${role}`, (done) => {
        request(app)
          .get(userGetResetPasswordHashRoute)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).false;
            done();
          });
      });
    }
  });

  it('should NOT get reset password hash without token', (done) => {
    request(app)
      .get(userGetResetPasswordHashRoute)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get reset password hash with expired token', (done) => {
    request(app)
      .get(userGetResetPasswordHashRoute)
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
});
