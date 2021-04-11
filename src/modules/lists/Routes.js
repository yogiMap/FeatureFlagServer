import { Router } from 'express';
import serviceHeader from '../utils/serviceHeader';
import userCheckAuth from '../user/middlewares/userCheckAuth';
import getBaseList from './controllers/getBaseList';

const router = Router();

router.get('/base', serviceHeader('getBaseList'), userCheckAuth, getBaseList);

export default router;
