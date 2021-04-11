import { Router } from 'express';
import serviceHeader from '../utils/serviceHeader';
import userCheckPerm from '../permission/userCheckPerm';
import userCheckAuth from '../user/middlewares/userCheckAuth';
import { fakeGeneratorBase } from './base/fakeGeneratorBase';

const router = Router();

router.post(
  '/base',
  serviceHeader('fakeGeneratorBase'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  fakeGeneratorBase,
);

export default router;
