import request from 'supertest';
import { expect } from 'chai';
import app from '../../../../index';
import { testUser, idOfNonexistentUser, wrongFormatUserId } from './../_data';
import { userRegisterAction } from './../_actions';
import User from '../../userModel';
import { roles, expiredToken } from '../../../_test/data';
import { roleHasPermission, token } from '../../../_test/helpers';

let userId;

describe('USER UPDATE SLACK MEMBER ID', () => {
  before('should delete a new user', () => {
    return User.deleteOne({ email: testUser.email });
  });

  before('should register a new user', (done) => {
    userRegisterAction(testUser).expect(201, done);
  });

  before('should get user id', (done) => {
    User.findOne({ email: testUser.email })
      .then((res) => {
        userId = res._id;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  roles.forEach((role) => {
    if (!roleHasPermission(role, 'user.update.any')) {
      it(`should NOT update 'user slack member id' with role ${role}`, (done) => {
        request(app)
          .post(`/user/${userId}/slack/member`)
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

  it('should NOT update `user slack member id` without token', (done) => {
    request(app)
      .post(`/user/${userId}/slack/member`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT update `user slack member id` with expired token', (done) => {
    request(app)
      .post(`/user/${userId}/slack/member`)
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

  it('should NOT update `user slack member id` for unregistered in Slack user', (done) => {
    request(app)
      .post(`/user/${userId}/slack/member`)
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT update `user slack member id` with an id of nonexistent user', (done) => {
    request(app)
      .post(`/user/${idOfNonexistentUser}/slack/member`)
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT update `user slack member id` with the wrong format user id', (done) => {
    request(app)
      .post(`/user/${wrongFormatUserId}/slack/member`)
      .set('Accept', 'application/json')
      .set('Authorization', process.env.TOKEN_ADMIN)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });
});
