import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';
import User from '../userModel';

let numberOfUsers;

describe('USER UPDATE FULFILLED ALL', () => {
  before('should count the number of users in the DB', async () => {
    numberOfUsers = await User.countDocuments({});
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.update.any')) {
      it(`should get the number of users with 'fulfilled: true' and 'fulfilled: false' with role ${role}`, (done) => {
        request(app)
          .get('/user/fulfilled/all')
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            expect(res.body.payload.false.n).eq(numberOfUsers);
            expect(res.body.payload.true.n).eq(0);
            done();
          });
      });
    } else {
      it(`should NOT get the number of users with 'fulfilled: true' and 'fulfilled: false' with role ${role}`, (done) => {
        request(app)
          .get('/user/fulfilled/all')
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

  it('should NOT get the number of users with `fulfilled: true` and `fulfilled: false` without token', (done) => {
    request(app)
      .get('/user/fulfilled/all')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get the number of users with `fulfilled: true` and `fulfilled: false` with expired token', (done) => {
    request(app)
      .get('/user/fulfilled/all')
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
