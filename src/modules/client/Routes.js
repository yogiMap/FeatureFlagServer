import { Router } from 'express';
import serviceHeader from '../utils/serviceHeader';
import userCheckPerm from '../permission/userCheckPerm';

import clientCreate from './controllers/create';
import userCheckAuth from '../user/middlewares/userCheckAuth';
import clientGetById from './controllers/getById';
import clientSearch from './controllers/search';
import clientUpdateById from './controllers/updateById';
import clientDeleteById from './controllers/deleteById';
import clientStats from './controllers/stats';
import pauseController from '../core/pauseController';

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/client/stats
  serviceHeader('clientStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('client.search.own'), // midlware has rights to do this operation such as client.search.own
  pauseController,
  clientStats,
);

router.post(
  '/', // POST /localhost:5000/client/stats
  serviceHeader('clientCreate'),
  userCheckAuth,
  userCheckPerm('client.create.own'),
  // pauseController,
  clientCreate,
);

router.get(
  '/:clientId',
  serviceHeader('clientGetById'),
  userCheckAuth,
  userCheckPerm('client.get.own'),
  pauseController,
  clientGetById,
);

router.post(
  '/search',
  serviceHeader('clientSearch'),
  userCheckAuth,
  userCheckPerm('client.search.own'),
  pauseController,
  clientSearch,
);

router.patch(
  '/:clientId',
  serviceHeader('clientUpdateById'),
  userCheckAuth,
  userCheckPerm('client.update.own'),
  pauseController,
  clientUpdateById,
);

router.delete(
  '/:clientId',
  serviceHeader('clientDeleteById'),
  userCheckAuth,
  userCheckPerm('client.delete.own'),
  pauseController,
  clientDeleteById,
);

export default router;
