import { expiredToken, roles } from '../data';
import { roleHasPermission, token } from '../helpers';
import request from 'supertest';
import app from '../../../index';
import { expect } from 'chai';
import { getByIdActionAPI } from '../actions/getByIdAction';

// The function is a common test suite to verify updateById controllers.
// The function should be invoked inside describe().
// To verify updateById controller make next predefined steps:
//  1) clean collections used in the test suite in before() hook inside the describe();
//  2) create all required parent entities and testable entity itself and get their ids in before() hook
//     (e.g. ...flash/card/_test/flashCardUpdateById.spec.js);
//  3) assign the testable entity id to the environment variables -> process.env[${ENTITY_NAME}_ID]
//     (e.g. for flashCard entity -> process.env.FLASHCARD_ID);
//  4) add key 'bodyForUpdate' in _data.js for testable entity with a function as a value,
//     the function should return an object with key you want to update
//     and random values which will invoked by faker.random.words() function (e.g. ...flash/card/_test/_data.js);
//  5) use the environment variable to pass entity id into the 'bodyForUpdate' if its required;
//  6) use the environment variables to get correct route for testable entity,
//     assigning correct function to the 'route' key in _data.js for testable entity (e.g. ...course/lesson/_test/_data.js).
const entityUpdateByIdTestSuite = (entityData) => {
  let entityId;
  let route;
  let body;
  const { entity } = entityData;

  it(`should get ${entity} id`, () => {
    body = entityData.bodyForUpdate();
    if (body[`${entity}Id`] || body._id) {
      entityId = body._id ? body._id : body[`${entity}Id`];
      route = entityData.route();
    } else {
      entityId = process.env[`${entity.toUpperCase()}_ID`];
      route = entityData.route() + '/' + entityId;
    }
    expect(entityId).to.have.lengthOf(24);
  });

  roles.forEach((role) => {
    if (roleHasPermission(role, entityData.updateByIdPerm)) {
      it(`should check that user with role ${role} can update the ${entity} by id`, (done) => {
        body = entityData.bodyForUpdate();
        request(app)
          .patch(route)
          .send(body)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            done();
          });
      });

      it(`should get ${entity} by id and check its updating`, (done) => {
        getByIdActionAPI(entity, entityData.route())
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            const response = res.body.payload ? res.body.payload : res.body;
            expect(response._id).equal(entityId);
            for (const key in body) {
              if (body.hasOwnProperty(key) && !key.toLowerCase().includes('id')) {
                typeof body[key] === 'object'
                  ? expect(response[key]).to.deep.equal(body[key])
                  : expect(response[key]).equal(body[key]);
              }
            }
            done();
          });
      });
    } else {
      it(`should check that user with role ${role} cannot update the ${entity} by id`, (done) => {
        request(app)
          .patch(route)
          .send(entityData.bodyForUpdate())
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-type', /json/)
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).false;
            done();
          });
      });
    }
  });

  it(`should check that user without token can not update ${entity}`, (done) => {
    request(app)
      .patch(route)
      .send(entityData.bodyForUpdate())
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it(`should check that user with expired token can not update ${entity}`, (done) => {
    request(app)
      .patch(route)
      .send(entityData.bodyForUpdate())
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

export default entityUpdateByIdTestSuite;
