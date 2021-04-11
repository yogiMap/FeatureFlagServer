import mongoose from 'mongoose';
import permissions from '../permission/roles';

const shape = (roles) => ({
  emailConfirmation: {
    confirmed: true,
    hash: '5df552d8aee9a784eb6a2d3a',
  },
  phoneConfirmation: {
    confirmed: false,
    code: '66672',
  },
  resetPassword: {
    history: [],
  },
  name: `${roles[0]} ${roles[0]}`,
  firstName: `${roles[0]}`,
  lastName: `${roles[0]}`,
  codewarsAnalytics: [],
  about: `About ${roles[0]}`,
  goals: `Goals ${roles[0]}`,
  groups: [],
  courses: [],
  roles: roles,
  active: true,
  lastLogin: new Date(0),
  englishLevel: 'Pre-Intermediate',
  tShirtSize: '',
  deliveryAddress: '',
  personalAddress: {
    countryName: 'Belarus',
    countryCode: '375',
  },
  fulfilled: false,
  email: `${roles[0]}@${roles[0]}.${roles[0]}`,
  phone: '17775551122',
  codewarsId: null,
  password: '$2a$10$P0nOOU1/FGjCwaY.NbiQDOg/kqUzFRMWyhRRXQYCXJ50IZ/UMfPTa', // 123123
  createdAt: new Date(),
  updatedAt: new Date(),
  links: {
    codewarsUsername: 'Viktor%20Bogutskii',
  },
});

export const password = '123123';

export const user = {
  admin: {
    _id: new mongoose.Types.ObjectId(),
    ...shape(['admin']),
  },

  new: {
    _id: new mongoose.Types.ObjectId(),
    ...shape(['new']),
  },
};

export const roles = Object.keys(permissions);

export const expiredToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QudGVzdCIsInVzZXJJZCI6IjVlMWNjNmM0MjZjY2I0NWE4MWE4NTQ1YiIsImNvZGV3YXJzSWQiOm51bGwsImlhdCI6MTU3ODk0NDI0MiwiZXhwIjoxNTc5ODA4MjQyfQ.qYCD6TgcGT5K1DSkIsSNAhDWr9qqJR9PVKUu_bLtAGA';
