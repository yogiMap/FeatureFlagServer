import { Router } from 'express';
import { service } from './serviceControllers';
import userCheckAuth from '../user/middlewares/userCheckAuth';
import userCheckPerm from '../permission/userCheckPerm';
import serviceHeader from '../utils/serviceHeader';

const router = Router();

router.get(
  '/',
  serviceHeader('service'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  service,
);

export default router;
