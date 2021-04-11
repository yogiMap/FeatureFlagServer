import request from 'supertest';
import app from '../../../index';

export function userRegisterAction(user) {
  return request(app).post('/user').send(user);
}

export function userLoginAction({ email, password }) {
  return request(app).post('/user/login').send({ email, password });
}

export function userPasswordResetRequestAction(email) {
  return request(app).post('/user/password/reset/request').send(email);
}
