import Group from '../../group/Model';

export default function addFlagToGroupQuery({ flagId, groupId }) {
  return Group.updateOne(
    { _id: groupId },
    { $addToSet: { flag: flagId } },
    { runvalidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        return message.success('Ok', doc);
      } else {
        return message.fail('Group is not updated');
      }
    })
    .catch((error) => {
      analytics(FLAG_ADD_TO_GROUP_QUERY_ERROR, {
        groupId,
        flagId,
        controller: 'addFlagToGroupQuery',
      });
      throw new Error(error);
    });
}
