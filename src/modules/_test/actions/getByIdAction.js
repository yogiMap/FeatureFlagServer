import request from 'supertest';
import app from '../../../index';

// the function is a common getById action
// the function has to be called inside describe()
// entity id is passed over environment variable
// assign the entity id to process.env[`${ENTITY_NAME}_ID`] variable
// e.g. for flashCard entity -> process.env.FLASHCARD_ID
export const getByIdActionAPI = (entity, route) => {
  if (entity.includes('quiz')) {
    route = route + '/' + process.env[`${entity.slice(5).toUpperCase()}_ID`];
  } else {
    route = route + '/' + process.env[`${entity.toUpperCase()}_ID`];
  }
  return request(app)
    .get(route)
    .set('Accept', 'application/json')
    .set('Authorization', process.env.TOKEN_ADMIN);
};
