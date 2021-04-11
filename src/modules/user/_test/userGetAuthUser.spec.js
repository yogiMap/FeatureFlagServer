import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';

const responseStructureGetAuthUser = [
  'emailConfirmation',
  'phoneConfirmation',
  'resetPassword',
  'links',
  'lastLogin',
  'shippingAddress',
  'name',
  'firstName',
  'lastName',
  'codewarsAnalytics',
  'about',
  'goals',
  'groups',
  'courses',
  'roles',
  'active',
  'englishLevel',
  'tShirtSize',
  'deliveryAddress',
  'fulfilled',
  '_id',
  'email',
  'phone',
  'codewarsId',
  'createdAt',
  'updatedAt',
  'acl',
];

describe('USER GET AUTH USER', () => {
  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.auth')) {
      it(`should get authorization for user with role ${role}`, (done) => {
        request(app)
          .get('/user/auth')
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.all.keys(...responseStructureGetAuthUser);
            done();
          });
      });
    } else {
      it(`should NOT get authorization for user with role ${role}`, (done) => {
        request(app)
          .get('/user/auth')
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

  it('should NOT get authorization for user without token', (done) => {
    request(app)
      .get('/user/auth')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get authorization for user with expired token', (done) => {
    request(app)
      .get('/user/auth')
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
