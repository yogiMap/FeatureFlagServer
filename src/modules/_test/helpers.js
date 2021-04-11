import permissions from '../permission/roles';

export const roleHasPermission = (role, action) => permissions[role].includes(action);
export const token = (role) => process.env[`TOKEN_${role.toUpperCase()}`];
