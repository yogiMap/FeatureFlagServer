import analyticsRouter from '../analytics/Routes';
import userRouter from '../user/userRoutes';
import infoRouter from '../info/infoRoutes';
import serviceRouter from '../service/serviceRoutes';
import baseRouter from '../_base/Routes';
import flagRouter from '../flag/Routes';
import groupRouter from '../group/Routes';

import listRouter from '../lists/Routes';

export default function routes(app) {
  app.use('/base', baseRouter);
  app.use('/flag', flagRouter);
  app.use('/group', groupRouter);
  app.use('/user', userRouter);
  app.use('/analytics', analyticsRouter);

  app.use('/info', infoRouter);
  app.use('/service', serviceRouter);

  app.use('/list', listRouter);
}
