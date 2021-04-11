import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import { testUser } from './_data';
import { userRegisterAction } from './_actions';
import User from '../userModel';

// console.log('===TOKEN_ADMIN======' + process.env.TOKEN_ADMIN);
// console.log('===TOKEN_STUDENT====' + process.env.TOKEN_STUDENT);

let REG_USER = null;

describe('USER REGISTER', () => {
  before(() => {
    return User.deleteOne({ email: testUser.email });
  });

  it('should register as new user', (done) => {
    userRegisterAction(testUser)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should NOT register user with the same credentials', (done) => {
    userRegisterAction(testUser)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('check user role `new` by email from DB', (done) => {
    User.find({ email: testUser.email })
      .then((res) => {
        REG_USER = res[0];
        expect(res[0].roles).include('new');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should check if user was register successfully', (done) => {
    request(app)
      .get(`/user/email/${testUser.email}`)
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        expect(res.body.payload.name).eq(`${testUser.firstName} ${testUser.lastName}`);
        done();
      });
  });

  it('should user has a proper structure', () => {
    expect(REG_USER.email).eq(testUser.email);
    expect(REG_USER.phone).eq(testUser.phone);
  });
});
