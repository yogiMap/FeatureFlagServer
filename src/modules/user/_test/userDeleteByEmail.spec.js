import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { testUser } from './_data';
import { userRegisterAction } from './_actions';
import User from '../userModel';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';

describe('USER DELETE BY EMAIL', () => {
  beforeEach('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  beforeEach('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.delete.any')) {
      it(`should delete user by email with role ${role}`, (done) => {
        request(app)
          .delete(`/user/email/${testUser.email}`)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            done();
          });
      });
    } else {
      it(`should NOT delete user by email with role ${role}`, (done) => {
        request(app)
          .delete(`/user/email/${testUser.email}`)
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

  it('should NOT delete user by email without token', (done) => {
    request(app)
      .delete(`/user/email/${testUser.email}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT delete user by email with expired token', (done) => {
    request(app)
      .delete(`/user/email/${testUser.email}`)
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
