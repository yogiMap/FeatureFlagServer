import message from '../utils/messages';
import { get } from 'lodash';

const userHasCompanyAccount = (req, res, next) => {
  const companyAccountId = get(req, 'userData.companyAccountId');
  if (companyAccountId) next();
  else res.status(400).json(message.fail('No companyAccountId'));
};

export default userHasCompanyAccount;
