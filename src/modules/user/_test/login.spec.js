import { expect } from 'chai';
import { testUser } from './_data';
import { userLoginAction, userRegisterAction } from './_actions';
import User from '../userModel';

describe('USER LOGIN', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  it('should login user', (done) => {
    userLoginAction({ email: testUser.email, password: testUser.password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.token).not.empty;
        done();
      });
  });
});
