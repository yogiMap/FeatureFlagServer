import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../index';
import { testUser, idOfNonexistentUser, wrongFormatHash, invalidHash } from '../_data';
import { userRegisterAction } from '../_actions';
import User from '../../userModel';

let userId = null;
let hash = null;
let users = null;

describe('USER EMAIL CONFIRM', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should get user id and hash', (done) => {
    User.findOne({ email: testUser.email })
      .select('+emailConfirmation.hash')
      .then((res) => {
        userId = res._id;
        hash = res.emailConfirmation.hash;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should NOT confirm email with invalid hash', (done) => {
    request(app)
      .get(`/user/verify/email/${userId}/${invalidHash}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should check that `emailConfirmation` is false in DB', (done) => {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        users = res.body.payload;
        if (err) return done(err);
        expect(res.body.success).true;
        expect(users[users.length - 1]._id).eq(userId.toString());
        expect(users[users.length - 1].emailConfirmed).false;
        done();
      });
  });

  it('should NOT confirm email with the wrong hash format', (done) => {
    request(app)
      .get(`/user/verify/email/${userId}/${wrongFormatHash}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should check that `emailConfirmation` is false in DB', (done) => {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        users = res.body.payload;
        if (err) return done(err);
        expect(res.body.success).true;
        expect(users[users.length - 1]._id).eq(userId.toString());
        expect(users[users.length - 1].emailConfirmed).false;
        done();
      });
  });

  it('should NOT confirm email with an id of nonexistent user', (done) => {
    request(app)
      .get(`/user/verify/email/${idOfNonexistentUser}/${hash}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should confirm email with correct id and hash', (done) => {
    request(app)
      .get(`/user/verify/email/${userId}/${hash}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should check that `emailConfirmation` is true in DB', (done) => {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        users = res.body.payload;
        if (err) return done(err);
        expect(res.body.success).true;
        expect(users[users.length - 1]._id).eq(userId.toString());
        expect(users[users.length - 1].emailConfirmed).true;
        done();
      });
  });
});
