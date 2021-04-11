import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';
import { userRegisterAction } from './_actions';
import { testUser } from './_data';
import User from '../userModel';

const searchData = {
  name: `${testUser.firstName} ${testUser.lastName}`,
  email: testUser.email,
  phone: testUser.phone,
  role: 'new',
  group: '',
};

describe('USER SEARCH', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.search')) {
      it(`should be able to search for a user with role ${role}`, (done) => {
        request(app)
          .post('/user/search')
          .send(searchData)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.items.length).eq(1);
            expect(res.body.items[0].name).eq(searchData.name);
            expect(res.body.items[0].email).eq(searchData.email);
            expect(res.body.items[0].phone).eq(searchData.phone);
            expect(res.body.items[0].roles).to.deep.eq([searchData.role]);
            expect(res.body.items[0].groups).to.be.an('array').that.is.empty;
            done();
          });
      });
    } else {
      it(`should NOT be able to search for a user with role ${role}`, (done) => {
        request(app)
          .post('/user/search')
          .send(searchData)
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

  it('should NOT be able to search for a user without token', (done) => {
    request(app)
      .post('/user/search')
      .send(searchData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT be able to search for a user with expired token', (done) => {
    request(app)
      .post('/user/search')
      .send(searchData)
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
