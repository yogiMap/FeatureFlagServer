import express from 'express';
import mongoConnection from './modules/core/db';
import logger from './modules/core/logger';
import parseResponse from './modules/core/parseResponse';
import ignoreFavicon from './modules/core/ignoreFavicon';
import routes from './modules/core/routes';
import cors from './modules/core/cors';
import errorHandling from './modules/core/errorHandling';
import pause from './modules/core/pause';
import chai from 'chai';
chai.use(require('chai-datetime'));
import * as Sentry from '@sentry/node';

const PORT = +process.env.PORT || 6000;
const app = express();

Sentry.init({ dsn: process.env.SENTRY });

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.disable('x-powered-by'); // DISABLE EXPRESS SIGNATURE
mongoConnection();
logger(app);
parseResponse(app);
cors(app);
ignoreFavicon(app);
pause(app);
routes(app);
app.use(Sentry.Handlers.errorHandler());
errorHandling(app);

// The error handler must be before any other error middleware and after all controllers

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
});

// ===== PORT =====
app.listen(PORT, () => {
  console.log(
    `Node cluster worker ${process.pid}: listening on port ${PORT} - env: ${process.env.NODE_ENV}`,
  );
});

export default app;
