import Analytics from '../Model';
import chalk from 'chalk';
import mongoose from 'mongoose';

const log = console.log;
import { get } from 'lodash';
// import { visitor } from '../../../index';

export default function analytics(event, params = null) {
  const _id = new mongoose.Types.ObjectId();

  // const supportedCategories = ['SUCCESS', 'FAIL', 'ERROR'];
  // const separatorIndex = event.lastIndexOf('_');
  // const analyticsCategory = event.slice(separatorIndex + 1);
  // const eventCategory = supportedCategories.includes(analyticsCategory)
  //  ? analyticsCategory
  //  : 'ERROR';
  // const eventAction = event.slice(0, separatorIndex);
  // const eventLabel = _id.toString();
  // visitor.event(eventCategory, eventAction, eventLabel).send();

  const user = get(params, 'user', null);
  if (user) delete params.user;

  const requestMethod = get(params, 'req.method', null);
  const endpoint = get(params, 'req.originalUrl', null);
  if (requestMethod) params.requestMethod = requestMethod;
  if (endpoint) params.endpoint = endpoint;
  delete params.req;

  const newAnalytics = new Analytics({
    _id,
    event,
    params,
    user,
  });

  const message = chalk`
      event: {yellow ${event}} 
      params: {yellow ${JSON.stringify(params)}} 
      user: {yellow ${user}}
      `;

  newAnalytics
    .save()
    .then(() => {
      if (process.env.MAIL_SILENT !== 'true') {
        log(chalk.black.bgYellowBright.bold(' ANALYTICS: '), message);
      }
    })
    .catch((err) => {
      log(chalk.whiteBright.bgRed.bold(' ANALYTICS error '), message);
      log(chalk.gray(err));
    });

  return _id;
}
