import message from '../../utils/messages';
import analytics from '../../analytics/controllers/analytics';
import { listRoles } from '../../permission/roles';

const userGetAllRoles = (req, res) => {
  const { userId } = req.userData;
  //
  analytics('USER_GET_ALL_ROLES_SUCCESS', {
    roles: listRoles,
    user: userId,
  });

  res
    .status(200)
    .json(message.success('Get all roles. Success', [...listRoles, 'admin']));
};

export default userGetAllRoles;
