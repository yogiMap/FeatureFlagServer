export const checkPassword = (password) => /(?=.{5,})/.test(password);

import mongoose from 'mongoose/';
const { ObjectId } = mongoose.Types;
export const validateObjectId = (id) =>
  ObjectId.isValid(id) && new ObjectId(id).toString() === id;
