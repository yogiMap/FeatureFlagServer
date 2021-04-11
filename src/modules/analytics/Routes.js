import { Router } from 'express';

import getById from './controllers/getById';
import serviceHeader from '../utils/serviceHeader';

const router = Router();

router.get('/:analyticsId', serviceHeader('analyticsGetById'), getById);

export default router;
