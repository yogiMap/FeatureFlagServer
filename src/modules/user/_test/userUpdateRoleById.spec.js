import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import User from '../userModel';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';
import { testUser, wrongFormatUserId, idOfNonexistentUser } from './_data';
import { userRegisterAction } from './_actions';

let userId = null;
let userUpdateRoleByIdRoute = null;
let count = 0;
const bodyForNegativeTests = { roles: ['teacher'] };

describe('USER UPDATE ROLE BY ID', () => {
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
        userUpdateRoleByIdRoute = `/user/${userId}`;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.update.any')) {
      it(`should update role by user id as ${role} but should exclude role 'admin' from the body`, (done) => {
        request(app)
          .patch(userUpdateRoleByIdRoute)
          .send({ roles: ['admin', 'student'] })
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            count++;
            expect(res.body.success).true;
            done();
          });
      });

      it('should check that user role is updated in DB and doesn`t include role "admin"', (done) => {
        User.findById(userId)
          .then((res) => {
            expect(res.roles).to.deep.eq(['student']);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    } else {
      it(`should NOT update role by user id as ${role}`, (done) => {
        request(app)
          .patch(userUpdateRoleByIdRoute)
          .send(bodyForNegativeTests)
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

      it('should check that user role is NOT updated in DB', (done) => {
        User.findById(userId)
          .then((res) => {
            if (count === 0) {
              expect(res.roles).to.deep.eq(['new']);
            } else if (count >= 1) {
              expect(res.roles).to.deep.eq(['student']);
            }
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    }
  });

  it('should NOT update role by user id if the body contains only role "admin"', (done) => {
    request(app)
      .patch(userUpdateRoleByIdRoute)
      .send({ roles: ['admin'] })
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

  it('should NOT update role by user id with the wrong format user id', (done) => {
    request(app)
      .patch(`/user/${wrongFormatUserId}`)
      .send(bodyForNegativeTests)
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

  it('should NOT update role by user id with an id of nonexistent user', (done) => {
    request(app)
      .patch(`/user/${idOfNonexistentUser}`)
      .send(bodyForNegativeTests)
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

  it('should NOT update role by user id without token', (done) => {
    request(app)
      .patch(userUpdateRoleByIdRoute)
      .send(bodyForNegativeTests)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT update role by user id with expired token', (done) => {
    request(app)
      .patch(userUpdateRoleByIdRoute)
      .send(bodyForNegativeTests)
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

  it('should check that user role is NOT updated in DB after all the negative tests', (done) => {
    User.findById(userId)
      .then((res) => {
        expect(res.roles).to.deep.eq(['student']);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
