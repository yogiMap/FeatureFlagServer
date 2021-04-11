import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';

let arrayOfUserId;
const responseStructureGetById = [
  '_id',
  'name',
  'firstName',
  'lastName',
  'roles',
  'links',
];

describe('USER GET BY ID', () => {
  before('should get an array of user id', (done) => {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .end((err, res) => {
        if (err) return done(err);
        arrayOfUserId = res.body.payload.map((el) => el._id);
        done();
      });
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.auth')) {
      it(`should get user by id with role ${role}`, (done) => {
        request(app)
          .get(`/user/${arrayOfUserId[0]}`)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            expect(res.body._id).eq(arrayOfUserId[0]);
            expect(res.body).to.include.all.keys(...responseStructureGetById);
            done();
          });
      });
    } else {
      it(`should NOT get user by id with role ${role}`, (done) => {
        request(app)
          .get(`/user/${arrayOfUserId[0]}`)
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

  it('should NOT get user by id without token', (done) => {
    request(app)
      .get(`/user/${arrayOfUserId[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get user by id with expired token', (done) => {
    request(app)
      .get(`/user/${arrayOfUserId[0]}`)
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
