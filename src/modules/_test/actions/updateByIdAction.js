// the function is a shared action for entity update
// the function has to be called inside describe()
// entity id is passed over environment variable
// assign the entity id to process.env[`${ENTITY_NAME}_ID`] variable
// e.g. for group entity -> process.env.GROUP_ID
export const updateByIdAction = (entityData, setData = {}, pushData = {}) => {
  entityData.model
    .updateOne(
      { _id: process.env[`${entityData.entity.toUpperCase()}_ID`] },
      { $set: setData, $push: pushData },
      { runValidators: true },
    )
    .exec()
    .catch((err) => {
      console.log(err.message);
      return err;
    });
};
