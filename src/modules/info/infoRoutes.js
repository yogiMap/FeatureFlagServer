import { Router } from 'express';
import { info } from './infoControllers';
import serviceHeader from '../utils/serviceHeader';

const router = Router();

router.get('/', serviceHeader('info'), info);

export default router;
