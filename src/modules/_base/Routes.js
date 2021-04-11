import { Router } from 'express';
import serviceHeader from '../utils/serviceHeader';
import userCheckPerm from '../permission/userCheckPerm';

import baseCreate from './controllers/create';
import userCheckAuth from '../user/middlewares/userCheckAuth';
import baseGetById from './controllers/getById';
import baseSearch from './controllers/search';
import baseUpdateById from './controllers/updateById';
import baseDeleteById from './controllers/deleteById';
import baseStats from './controllers/stats';
import pauseController from '../core/pauseController';

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/base/stats
  serviceHeader('baseStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('base.search.own'), // midlware has rights to do this operation such as base.search.own
  pauseController,
  baseStats,
);

router.post(
  '/', // POST /localhost:5000/base/stats
  serviceHeader('baseCreate'),
  userCheckAuth,
  userCheckPerm('base.create.own'),
  // pauseController,
  baseCreate,
);

router.get(
  '/:baseId',
  serviceHeader('baseGetById'),
  userCheckAuth,
  userCheckPerm('base.get.own'),
  pauseController,
  baseGetById,
);

router.post(
  '/search',
  serviceHeader('baseSearch'),
  userCheckAuth,
  userCheckPerm('base.search.own'),
  pauseController,
  baseSearch,
);

router.patch(
  '/:baseId',
  serviceHeader('baseUpdateById'),
  userCheckAuth,
  userCheckPerm('base.update.own'),
  pauseController,
  baseUpdateById,
);

router.delete(
  '/:baseId',
  serviceHeader('baseDeleteById'),
  userCheckAuth,
  userCheckPerm('base.delete.own'),
  pauseController,
  baseDeleteById,
);

export default router;
