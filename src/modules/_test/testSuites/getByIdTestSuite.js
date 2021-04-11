import request from 'supertest';
import app from '../../../index';
import { expect } from 'chai';
import { roles, expiredToken } from '../data';
import { roleHasPermission, token } from '../helpers';

// the function is a shared test suite for verification getById controller
// the function has to be called inside describe()
// before calling the function implement entity create and get its id action
// entity id is passed over environment variable
// assign the entity id to process.env[`${ENTITY_NAME}_ID`] variable
// e.g. for group entity -> process.env.GROUP_ID
// the function doesn't delete any created entities
const entityGetByIdTestSuite = (entityData) => {
  let entityId;
  let route;
  const { entity } = entityData;

  if (entity === 'courseProgress') {
    it(`should get ${entity} get by id route`, () => {
      route = `${entityData.route()}`;
      expect(route).a('string');
    });
  } else {
    it(`should get ${entity} id`, () => {
      entityId = process.env[`${entity.toUpperCase()}_ID`];
      route = `${entityData.route()}/${entityId}`;
      expect(entityId).to.have.lengthOf(24);
    });
  }

  roles.forEach((role) => {
    if (roleHasPermission(role, entityData.getByIdPerm)) {
      it(`should get ${entity} by id with user role ${role}`, (done) => {
        request(app)
          .get(route)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            const response = res.body.payload ? res.body.payload : res.body;
            expect(response).to.include.all.keys(...entityData.getByIdResStructure);
            if (entity !== 'courseProgress') {
              expect(response._id).equal(entityId);
            }
            done();
          });
      });
    } else {
      it(`should NOT get ${entity} by id with user role ${role}`, (done) => {
        request(app)
          .get(route)
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

  it(`should NOT get ${entity} by id without TOKEN`, (done) => {
    request(app)
      .get(route)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it(`should NOT get ${entity} by id with expired TOKEN`, (done) => {
    request(app)
      .get(route)
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

export default entityGetByIdTestSuite;
