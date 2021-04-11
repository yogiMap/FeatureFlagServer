export const listRoles = ['new', 'verified', 'impersonate'];

const base = [
  'base.create.own',
  'base.get.own',
  'base.search.own',
  'base.update.own',
  'base.delete.own',
];

const flag = [
  'flag.create.own',
  'flag.get.own',
  'flag.search.own',
  'flag.update.own',
  'flag.delete.own',
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

  verified: ['user.auth', ...base, ...flag],

  admin: [
    // USER
    ...userAdmin,

    // EXAMPLE
    ...base,
    ...flag,
  ],

  // impersonate: [
  //   // USER
  //   'user.search',
  //   'user.impersonate',
  //   'user.stats',
  // ],
};

export default roles;
