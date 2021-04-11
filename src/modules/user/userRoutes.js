import { Router } from 'express';
import userCheckAuth from './middlewares/userCheckAuth';
import userCheckPerm from '../permission/userCheckPerm';
import userCheckEmailSendPerm from '../permission/userCheckEmailSendPerm';
import userRegister from './controllers/userControllerRegister';
import userLogin from './controllers/userControllerLogin';
import userPasswordResetRequest from './controllers/resetPassword/userControllerPasswordResetRequest';
import userPasswordIsValidResetLink from './controllers/resetPassword/userControllerIsValidResetLink';
import userPasswordResetNew from './controllers/resetPassword/userControllerPasswordResetNew';
import userPasswordUpdate from './controllers/resetPassword/userControllerPasswordUpdate';
import userGetAll from './controllers/userControllerGetAll';
import userGetById from './controllers/userControllerGetById';
import userGetAuthUser from './controllers/userControllerGetAuthUser';
import userDeleteById from './controllers/userControllerDeleteById';
import userUpdateRoleById from './controllers/userControllerUpdateRoleById';
import userUpdateSelf from './controllers/userControllerUpdateSelf';
import userEmailConfirm from './controllers/mailConfirm/userControllerEmailConfirm';
import userVerifyEmailSend from './controllers/mailConfirm/userVerifyEmailSend';
import serviceHeader from '../utils/serviceHeader';
import getResetPasswordHash from './controllers/resetPassword/getResetPasswordHash';
import userDeleteByEmail from './controllers/userControllerDeleteByEmail';
import userGetByEmail from './controllers/userControllerGetByEmail';
import userSearch from './controllers/userSearch';
import userGetAllRoles from './controllers/userGetAllRoles';
import userImpersonate from './controllers/userImpersonate';
import userStats from './controllers/userStats';
import userSearchHelper from './helpers/userSearchHelper';

const router = Router();

router.post('/', serviceHeader('userRegister'), userRegister); //   POST localhost:5000/user/

router.post('/login', serviceHeader('userLogin'), userLogin);

router.get(
  '/auth',
  serviceHeader('userGetAuthUser'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userGetAuthUser,
);

router.get(
  '/:userId',
  serviceHeader('userGetById'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userGetById,
);

router.post(
  '/search/user',
  serviceHeader('userSearch'),
  userCheckAuth,
  userCheckPerm('user.get.all'),
  userSearchHelper,
);

router.get(
  '/stats',
  serviceHeader('userStats'),
  userCheckAuth,
  userCheckPerm('user.stats'),
  userStats,
);

router.post(
  '/impersonate',
  serviceHeader('userImpersonate'),
  userCheckAuth,
  userCheckPerm('user.impersonate'),
  userImpersonate,
);

router.get(
  '/',
  serviceHeader('userGetAll'),
  userCheckAuth,
  userCheckPerm('user.get.all'),
  userGetAll,
);

router.get(
  '/roles',
  serviceHeader('userGetAll'),
  userCheckAuth,
  userCheckPerm('user.get.all'),
  userGetAllRoles,
);

router.post(
  '/search',
  serviceHeader('userSearch'),
  userCheckAuth,
  userCheckPerm('user.search'),
  userSearch,
);

router.post(
  '/password/reset/request',
  serviceHeader('userPasswordResetRequest'),
  userPasswordResetRequest,
);
router.post(
  '/password/reset/valid',
  serviceHeader('userPasswordIsValidResetLink'),
  userPasswordIsValidResetLink,
);
router.post(
  '/password/reset/new',
  serviceHeader('userPasswordResetNew'),
  userPasswordResetNew,
);

router.post(
  '/password/update/',
  serviceHeader('userPasswordUpdate'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userPasswordUpdate,
);

router.get(
  '/hash/:userId',
  serviceHeader('getResetPasswordHash'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  getResetPasswordHash,
);

router.get(
  '/email/:email',
  serviceHeader('userGetByEmail'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  userGetByEmail,
);

router.patch(
  '/',
  serviceHeader('userUpdateSelf'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userUpdateSelf,
);

router.patch(
  '/:userId',
  serviceHeader('userUpdateRoleById'),
  userCheckAuth,
  userCheckPerm('user.update.any'),
  userUpdateRoleById,
);

router.delete(
  '/:userId',
  serviceHeader('userDeleteById'),
  userCheckAuth,
  userCheckPerm('user.delete.any'),
  userDeleteById,
);

router.delete(
  '/email/:email',
  serviceHeader('userDeleteByEmail'),
  userCheckAuth,
  userCheckPerm('user.delete.any'),
  userDeleteByEmail,
);

router.get(
  '/verify/email/:userId/:hash',
  serviceHeader('userEmailConfirm'),
  userEmailConfirm,
);

router.post(
  '/verify/email/send',
  serviceHeader('userVerifyEmailSend'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userCheckEmailSendPerm,
  userVerifyEmailSend,
);

export default router;
