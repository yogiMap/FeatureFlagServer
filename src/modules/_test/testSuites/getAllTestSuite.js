import { expiredToken, roles } from '../data';
import { roleHasPermission, token } from '../helpers';
import request from 'supertest';
import app from '../../../index';
import { expect } from 'chai';

// The function is a common test suite to verify getAll controllers.
// The function should be invoked inside describe().
// To verify getAll controller make next predefined steps:
//  1) clean collections used in the test suite in before() hook inside the describe();
//  2) create all required parent entities and testable entity itself in before() hook
//     (e.g. ...flash/group/_test/flashGroupGetAll.spec.js);
//  3) the _data.js of the testable entity should contain the following keys:
//     entity with string value,
//     route with function value,
//     model with mongoose.Schema() value
//     (e.g. ...flash/group/_test/_data.js).
const entityGetAllTestSuite = (entityData, actualNumberOfEntities) => {
  const { entity } = entityData;

  roles.forEach((role) => {
    if (roleHasPermission(role, entityData.getAllPerm)) {
      it(`should get all ${entity}s with user role ${role}`, (done) => {
        request(app)
          .get(entityData.route())
          .set('Accept', 'application/json')
          .set('Authorization', token(role))
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            if (res.body.payload) {
              expect(res.body.success).true;
              expect(res.body.payload).to.be.an('array');
              expect(res.body.payload).to.have.lengthOf(actualNumberOfEntities);
            } else {
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf(actualNumberOfEntities);
            }
            done();
          });
      });
    } else {
      it(`should NOT get all ${entity}s with user role ${role}`, (done) => {
        request(app)
          .get(entityData.route())
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

  it(`should NOT get all ${entity}s without TOKEN`, (done) => {
    request(app)
      .get(entityData.route())
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        return done();
      });
  });

  it(`should NOT get all ${entity}s with incorrect TOKEN`, (done) => {
    request(app)
      .get(entityData.route())
      .set('Accept', 'application/json')
      .set('Authorization', expiredToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).false;
        return done();
      });
  });
};

export default entityGetAllTestSuite;
