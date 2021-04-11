import request from 'supertest';
import { expect } from 'chai';
import app from '../../../index';
import User from '../userModel';
import { roles, expiredToken } from '../../_test/data';
import { roleHasPermission, token } from '../../_test/helpers';

const userUpdateSelfData = {
  firstName: 'UpdateFirstName',
  lastName: 'UpdateLastName',
  phone: '123456654321',
  links: { codewarsUsername: 'Viktor%20Bogutskii' },
  about: 'UpdateAbout',
  goals: 'UpdateGoals',
  englishLevel: 'Intermediate',
  tShirtSize: 'Men/Unisex - XS',
  deliveryAddress: '696 10th Ave, New York, NY 10019',
  shippingAddress: { countryName: 'Ukraine' },
  roles: ['admin'],
};

describe('USER UPDATE SELF', () => {
  roles.forEach((role) => {
    if (roleHasPermission(role, 'user.auth')) {
      it(`should update self with role ${role}`, (done) => {
        request(app)
          .patch('/user')
          .send(userUpdateSelfData)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            done();
          });
      });

      it('should check that user is updated in DB', (done) => {
        User.findOne({ email: `${role}@${role}.${role}` })
          .then((res) => {
            // verify that all fields are updated and the role remains unchanged
            expect(res.name).eq(
              `${userUpdateSelfData.firstName} ${userUpdateSelfData.lastName}`,
            );
            expect(res.firstName).eq(userUpdateSelfData.firstName);
            expect(res.lastName).eq(userUpdateSelfData.lastName);
            expect(res.phone).eq(userUpdateSelfData.phone);
            expect(res.links.codewarsUsername).eq(
              userUpdateSelfData.links.codewarsUsername,
            );
            expect(res.about).eq(userUpdateSelfData.about);
            expect(res.goals).eq(userUpdateSelfData.goals);
            expect(res.englishLevel).eq(userUpdateSelfData.englishLevel);
            expect(res.tShirtSize).eq(userUpdateSelfData.tShirtSize);
            expect(res.deliveryAddress).eq(userUpdateSelfData.deliveryAddress);
            expect(res.shippingAddress.countryName).eq(
              userUpdateSelfData.shippingAddress.countryName,
            );
            expect(res.roles).to.deep.eq([`${role}`]);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    } else {
      it(`should NOT update self with role ${role}`, (done) => {
        request(app)
          .patch('/user')
          .send(userUpdateSelfData)
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

  it('should NOT get user by email without token', (done) => {
    request(app)
      .patch('/user')
      .send(userUpdateSelfData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it('should NOT get user by email with expired token', (done) => {
    request(app)
      .patch('/user')
      .send(userUpdateSelfData)
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
