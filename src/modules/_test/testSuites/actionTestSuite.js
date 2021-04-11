import { expiredToken, roles } from '../data';
import { roleHasPermission, token } from '../helpers';
import request from 'supertest';
import app from '../../../index';
import { expect } from 'chai';
import { getByIdActionAPI } from '../actions/getByIdAction';

// the function is a shared test suite for verification controller with action (like, dislike, understood)
// the function has to be called inside describe()
// before calling the function implement entity create and get its id action
// entity id is passed over environment variable
// assign the entity id to process.env[`${ENTITY_NAME}_ID`] variable
// e.g. for group entity -> process.env.GROUP_ID
// the function doesn't delete any created entities

const entityActionTestSuite = (entityData, action) => {
  const { entity } = entityData;
  let entityId = null;
  let numberOfActions = 0;
  let actionRoute = null;

  it(`should get ${entity} id`, () => {
    entityId = process.env[`${entity.toUpperCase()}_ID`];
    actionRoute = `${entityData.route()}/${entityId}/${action}`;
    expect(entityId).to.have.lengthOf(24);
  });

  it(`should check the ${entity} does not have ${action}`, (done) => {
    getByIdActionAPI(entity, `${entityData.route()}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        if (entity === 'diary') {
          expect(res.body[action]).to.be.empty;
        } else {
          expect(res.body.success).true;
          expect(res.body.payload[action]).to.be.empty;
        }
        done();
      });
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, entityData.getByIdPerm)) {
      it(`should ${action} ${entity} with user role ${role}`, (done) => {
        request(app)
          .post(actionRoute)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            numberOfActions++;
            done();
          });
      });
    } else {
      it(`should NOT ${action} ${entity} with user role ${role}`, (done) => {
        request(app)
          .post(actionRoute)
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

  it(`should check the ${entity} has ${action} by users with appropriate permissions`, (done) => {
    getByIdActionAPI(entity, `${entityData.route()}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        if (entity === 'diary') {
          expect(res.body[action]).to.have.lengthOf(numberOfActions);
        } else {
          expect(res.body.success).true;
          expect(res.body.payload[action]).to.have.lengthOf(numberOfActions);
        }
        done();
      });
  });

  it(`should NOT ${action} ${entity} without TOKEN`, (done) => {
    request(app)
      .post(actionRoute)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it(`should NOT ${action} ${entity} with expired TOKEN`, (done) => {
    request(app)
      .post(actionRoute)
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
};

export default entityActionTestSuite;
