import mongoose from 'mongoose';

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    name: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: {}, versionKey: false },
);

export default mongoose.model('Flag', Schema);
