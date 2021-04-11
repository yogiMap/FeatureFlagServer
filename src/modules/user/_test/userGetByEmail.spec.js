import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { userRegisterAction } from './_actions';
import { testUser } from './_data';
import User from '../userModel';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';

const responseStructureGetByEmail = [
  '_id',
  'name',
  'firstName',
  'lastName',
  'fulfilled',
  'englishLevel',
  'about',
  'goals',
  'roles',
  'groups',
  'codewarsAnalytics',
];

describe('USER GET BY EMAIL', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.update.any')) {
      it(`should get user by email with role ${role}`, (done) => {
        request(app)
          .get(`/user/email/${testUser.email}`)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            expect(res.body.payload).to.include.all.keys(...responseStructureGetByEmail);
            done();
          });
      });
    } else {
      it(`should NOT get user by email with role ${role}`, (done) => {
        request(app)
          .get(`/user/email/${testUser.email}`)
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

  it('should NOT get user by email without token', (done) => {
    request(app)
      .get(`/user/email/${testUser.email}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get user by email with expired token', (done) => {
    request(app)
      .get(`/user/email/${testUser.email}`)
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
