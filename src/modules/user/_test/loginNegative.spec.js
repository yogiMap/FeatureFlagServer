import { expect } from 'chai';
import { testUser } from './_data';
import { userLoginAction, userRegisterAction } from './_actions';
import User from '../userModel';

describe('USER LOGIN NEGATIVE', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  it('should NOT login user with empty email and password input', (done) => {
    userLoginAction({ email: '', password: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT login user with wrong email and password', (done) => {
    userLoginAction({ email: 'wrong', password: 'wrong' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT login user with empty email input', (done) => {
    userLoginAction({ email: '', password: testUser.password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT login user with wrong email', (done) => {
    userLoginAction({ email: 'wrong', password: testUser.password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT login user with empty password input', (done) => {
    userLoginAction({ email: testUser.email, password: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT login user with wrong password', (done) => {
    userLoginAction({ email: testUser.email, password: 'wrong' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
