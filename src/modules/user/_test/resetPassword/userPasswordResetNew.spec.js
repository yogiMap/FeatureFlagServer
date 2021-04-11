import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../index';
import {
  testUser,
  wrongFormatUserId,
  idOfNonexistentUser,
  wrongFormatHash,
  invalidHash,
} from '../_data';
import {
  userRegisterAction,
  userPasswordResetRequestAction,
  userLoginAction,
} from '../_actions';
import User from '../../userModel';
import faker from 'faker';

let userId = null;
let date = null;
let newDate = null;
let hash = null;
let expiredHash = null;
let h = 3; //hash expiration time in hours
const num = faker.random.number({ min: 1, max: 4 }); //less than 5 characters
const wrongFormatPassword = faker.internet.password(num);
const newPassword = faker.internet.password(5);
const userPasswordResetNewRoute = '/user/password/reset/new';

describe('USER PASSWORD RESET NEW - WITH CORRECT CREDENTIALS', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should send password reset request', (done) => {
    userPasswordResetRequestAction({ email: testUser.email }).expect(200, done);
  });

  before('should get user id and hash', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        userId = res._id;
        hash = res.resetPassword.hash;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should reset the user password and set a new password with all the correct fields', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: hash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).true;
        done();
      });
  });

  it('should check that hash is equal to an empty string in DB after user has already used it', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        expect(res.resetPassword.hash).to.be.empty;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should login user with new password', (done) => {
    userLoginAction({ email: testUser.email, password: newPassword })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.token).not.empty;
        done();
      });
  });

  it('should NOT reset the user password with all the correct fields if we send them again', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: hash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});

describe('USER PASSWORD RESET NEW - NEW PASSWORD VERIFICATION', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should send password reset request', (done) => {
    userPasswordResetRequestAction({ email: testUser.email }).expect(200, done);
  });

  before('should get user id and hash', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        userId = res._id;
        hash = res.resetPassword.hash;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should NOT reset the user password with the wrong new password format', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: hash,
        password: wrongFormatPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT reset the user password when new password is equal to an empty string', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: hash,
        password: '',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});

describe('USER PASSWORD RESET NEW - USER ID VERIFICATION', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should send password reset request', (done) => {
    userPasswordResetRequestAction({ email: testUser.email }).expect(200, done);
  });

  before('should get hash', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        hash = res.resetPassword.hash;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should NOT reset the user password with the wrong format user id', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: wrongFormatUserId,
        hash: hash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT reset the user password with an id of nonexistent user', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: idOfNonexistentUser,
        hash: hash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT reset the user password when user id is equal to an empty string', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: '',
        hash: hash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});

describe('USER PASSWORD RESET NEW - HASH VERIFICATION', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should send password reset request', (done) => {
    userPasswordResetRequestAction({ email: testUser.email }).expect(200, done);
  });

  before('should get user id and `resetPassword.date` in DB', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.date')
      .then((res) => {
        userId = res._id;
        date = res.resetPassword.date;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should NOT reset the user password with the wrong hash format', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: wrongFormatHash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT reset the user password with invalid hash', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: invalidHash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT reset the user password when hash is equal to an empty string', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: '',
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should get new date to check for expired hash', () => {
    newDate = new Date();
    newDate.setTime(date.getTime() - (h * 60 + 1) * 60 * 1000); //subtract h hours and 1 minute in milliseconds
    expect(newDate).to.beforeTime(date);
  });

  it('should update `resetPassword.date` in DB', (done) => {
    User.updateOne({ _id: userId }, { $set: { 'resetPassword.date': newDate } })
      .then((res) => {
        expect(res.n).eq(1);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get expired hash in DB', (done) => {
    User.findOne({ email: testUser.email })
      .select('resetPassword.hash')
      .then((res) => {
        expiredHash = res.resetPassword.hash;
        expect(expiredHash).to.have.lengthOf(24);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should NOT reset the user password with expired hash', (done) => {
    request(app)
      .post(userPasswordResetNewRoute)
      .set('Accept', 'application/json')
      .send({
        userId: userId,
        hash: expiredHash,
        password: newPassword,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
