import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { user, roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';

const numberOfRoles = Object.keys(user).length;

describe('USER GET ALL ROLES', () => {
  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.get.all')) {
      it(`should get all roles with user role  ${role}`, (done) => {
        request(app)
          .get('/user/roles')
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            expect(res.body.payload.length).eq(numberOfRoles);
            expect(res.body.payload).to.include(...roles);
            done();
          });
      });
    } else {
      it(`should NOT get all roles with user role ${role}`, (done) => {
        request(app)
          .get('/user/roles')
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

  it('should NOT get all roles without token', (done) => {
    request(app)
      .get('/user/roles')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get all roles with expired token', (done) => {
    request(app)
      .get('/user/roles')
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
