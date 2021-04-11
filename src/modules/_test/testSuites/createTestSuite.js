import request from 'supertest';
import app from '../../../index';
import { expect } from 'chai';
import { roles, expiredToken } from '../data';
import { roleHasPermission, token } from '../helpers';

// The function is a common test suite to verify create controllers.
// The function should be invoked inside describe().
// Don't forget to delete all created entities in after().
// To verify creation of nested (child) entity make next predefined steps in before():
//  1) implement parent entities creation and getting their ids before call the function;
//  2) assign the entities ids to the environment variables -> process.env[${ENTITY_NAME}_ID];
//     e.g. for group entity -> process.env.GROUP_ID
//  3) use the environment variables to get correct route for testable entity,
//     assigning correct function to the 'route' key in _data.js for testable entity;

const entityCreateTestSuite = (entityData) => {
  let expectedNumOfCreatedEntities = 0;
  let actualNumOfCreatedEntities = 0;
  let createdEntity = null;
  const { entity } = entityData;

  roles.forEach((role) => {
    if (roleHasPermission(role, entityData.createPerm)) {
      it(`should create ${entity} with user role ${role}`, (done) => {
        request(app)
          .post(entityData.route())
          .send(entityData.body)
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.success).true;
            expectedNumOfCreatedEntities++;
            done();
          });
      });
    } else {
      it(`should NOT create ${entity} with user role ${role}`, (done) => {
        request(app)
          .post(entityData.route())
          .send(entityData.body)
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

  it(`should NOT create ${entity} without TOKEN`, (done) => {
    request(app)
      .post(entityData.route())
      .send(entityData.body)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it(`should NOT create ${entity} with expired TOKEN`, (done) => {
    request(app)
      .post(entityData.route())
      .send(entityData.body)
      .set('Accept', 'application/json')
      .set('Authorization', expiredToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.success).false;
        done();
      });
  });

  it(`should check that created ${entity} has correct key's value`, (done) => {
    entityData.model
      .find()
      .then((res) => {
        actualNumOfCreatedEntities = res.length;
        createdEntity = res[0]._doc;
        Object.keys(entityData.body).forEach((el) => {
          if (entity === 'question' || entity === 'answer') {
            expect(createdEntity['variants']).to.be.an('array');
            expect(createdEntity).to.include.any.keys(entityData.body);
          } else if (
            ['lecture', 'answergroup'].includes(entity) &&
            ['groupId', 'questionGroupId'].includes(el)
          ) {
            expect(createdEntity[el].toString()).eq(entityData.body[el]);
          } else if (el.includes('Id')) {
            expect(createdEntity[el.replace('Id', '')].toString()).eq(
              entityData.body[el].toString(),
            );
          } else {
            typeof createdEntity[el] === 'object' && createdEntity[el] != null
              ? expect(createdEntity[el]).to.deep.equal(entityData.body[el])
              : expect(createdEntity[el]).equal(entityData.body[el]);
          }
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it(`should check amount of ${entity} entities in DB and through API tests`, () => {
    expect(expectedNumOfCreatedEntities).equal(actualNumOfCreatedEntities);
  });
};

export default entityCreateTestSuite;
