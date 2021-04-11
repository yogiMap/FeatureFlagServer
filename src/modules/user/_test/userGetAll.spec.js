import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';
import User from '../userModel';

let numberOfUsers;

describe('USER GET ALL', () => {
  before('should count the number of users in the DB', async () => {
    numberOfUsers = await User.countDocuments({});
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.get.all')) {
      it(`should get all users with user role  ${role}`, (done) => {
        request(app)
          .get('/user')
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            expect(res.body.payload.length).eq(numberOfUsers);
            expect(res.body.payload.every((el) => el._id && el.name && el.email)).true;
            done();
          });
      });
    } else {
      it(`should NOT get all users with user role ${role}`, (done) => {
        request(app)
          .get('/user')
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

  it('should NOT get all users without token', (done) => {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get all users with expired token', (done) => {
    request(app)
      .get('/user')
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
