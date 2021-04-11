import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { testUser } from './_data';
import { userRegisterAction } from './_actions';
import User from '../userModel';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';

let userId = null;
const userImpersonateRoute = '/user/impersonate';

describe('USER IMPERSONATE', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should get user id', (done) => {
    User.findOne({ email: testUser.email })
      .then((res) => {
        userId = res._id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.impersonate')) {
      it(`should allow the user with role ${role} to impersonate another user`, (done) => {
        request(app)
          .post(userImpersonateRoute)
          .send({ userId: userId })
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.token).not.empty;
            expect(res.body.userId).eq(userId.toString());
            expect(res.body.user.name).eq(`${testUser.firstName} ${testUser.lastName}`);
            done();
          });
      });
    } else {
      it(`should NOT allow the user with the role ${role} to impersonate another user`, (done) => {
        request(app)
          .post(userImpersonateRoute)
          .send({ userId: userId })
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

  it('should NOT allow the user to impersonate another user without token', (done) => {
    request(app)
      .post(userImpersonateRoute)
      .send({ userId: userId })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT allow the user to impersonate another user with expired token', (done) => {
    request(app)
      .post(userImpersonateRoute)
      .send({ userId: userId })
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
