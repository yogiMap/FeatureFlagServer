import { get } from 'lodash';

export default function userProfileFieldsMapping(body) {
  const firstName = get(body, 'firstName', '');
  const lastName = get(body, 'lastName', '');

  return {
    name: `${firstName} ${lastName}`.trim(),
    firstName: get(body, 'firstName', null),
    lastName: get(body, 'lastName', null),
    phone: get(body, 'phone', null),
    email: get(body, 'email', null),
    fax: get(body, 'fax', null),
  };
}
