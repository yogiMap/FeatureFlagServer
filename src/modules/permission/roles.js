export const listRoles = ['new', 'verified', 'impersonate'];

const base = [
  'base.create.own',
  'base.get.own',
  'base.search.own',
  'base.update.own',
  'base.delete.own',
];

const client = [
  'client.create.own',
  'client.get.own',
  'client.search.own',
  'client.update.own',
  'client.delete.own',
];

const userAdmin = [
  'user.auth',
  'user.get.all',
  'user.delete.any',
  'user.update.any',
  'user.search',
  'user.impersonate',
  'user.stats',
];

const roles = {
  new: ['user.auth'],

  verified: ['user.auth', ...base, ...client],

  admin: [
    // USER
    ...userAdmin,

    // EXAMPLE
    ...base,
  ],

  // impersonate: [
  //   // USER
  //   'user.search',
  //   'user.impersonate',
  //   'user.stats',
  // ],
};

export default roles;
