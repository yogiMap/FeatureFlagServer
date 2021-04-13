import { Router } from 'express';
import serviceHeader from '../utils/serviceHeader';
import userCheckPerm from '../permission/userCheckPerm';

import groupCreate from './controllers/create';
import userCheckAuth from '../user/middlewares/userCheckAuth';
import groupGetById from './controllers/getById';
import groupSearch from './controllers/search';
import groupUpdateById from './controllers/updateById';
import groupDeleteById from './controllers/deleteById';
import groupStats from './controllers/stats';
import pauseController from '../core/pauseController';

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/group/stats
  serviceHeader('groupStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('group.search.own'), // midlware has rights to do this operation such as group.search.own
  pauseController,
  groupStats,
);

router.post(
  '/', // POST /localhost:5000/group/stats
  serviceHeader('groupCreate'),
  userCheckAuth,
  userCheckPerm('group.create.own'),
  // pauseController,
  groupCreate,
);

router.get(
  '/:groupId',
  serviceHeader('groupGetById'),
  // userCheckAuth,
  // userCheckPerm('group.get.own'),
  // pauseController,
  groupGetById,
);

router.post(
  '/search',
  serviceHeader('groupSearch'),
  userCheckAuth,
  userCheckPerm('group.search.own'),
  pauseController,
  groupSearch,
);

router.patch(
  '/:groupId',
  serviceHeader('groupUpdateById'),
  userCheckAuth,
  userCheckPerm('group.update.own'),
  pauseController,
  groupUpdateById,
);

router.delete(
  '/:groupId',
  serviceHeader('groupDeleteById'),
  userCheckAuth,
  userCheckPerm('group.delete.own'),
  pauseController,
  groupDeleteById,
);

export default router;
