import { Router } from 'express';
import serviceHeader from '../utils/serviceHeader';
import userCheckPerm from '../permission/userCheckPerm';

import flagCreate from './controllers/create';
import userCheckAuth from '../user/middlewares/userCheckAuth';
import flagGetById from './controllers/getById';
import flagSearch from './controllers/search';
import flagUpdateById from './controllers/updateById';
import flagDeleteById from './controllers/deleteById';
import flagStats from './controllers/stats';
import pauseController from '../core/pauseController';

const router = Router();

// CRUD

router.get(
  '/stats', // GET /localhost:5000/flag/stats
  serviceHeader('flagStats'), // mark request
  userCheckAuth, // midlware  needed to check if user has rights to do the request
  userCheckPerm('flag.search.own'), // midlware has rights to do this operation such as flag.search.own
  pauseController,
  flagStats,
);

router.post(
  '/', // POST /localhost:5000/flag/stats
  serviceHeader('flagCreate'),
  userCheckAuth,
  userCheckPerm('flag.create.own'),
  // pauseController,
  flagCreate,
);

router.get(
  '/:flagId',
  serviceHeader('flagGetById'),
  userCheckAuth,
  userCheckPerm('flag.get.own'),
  pauseController,
  flagGetById,
);

router.post(
  '/search',
  serviceHeader('flagSearch'),
  userCheckAuth,
  userCheckPerm('flag.search.own'),
  pauseController,
  flagSearch,
);

router.patch(
  '/:flagId',
  serviceHeader('flagUpdateById'),
  userCheckAuth,
  userCheckPerm('flag.update.own'),
  pauseController,
  flagUpdateById,
);

router.delete(
  '/:flagId',
  serviceHeader('flagDeleteById'),
  userCheckAuth,
  userCheckPerm('flag.delete.own'),
  pauseController,
  flagDeleteById,
);

export default router;
