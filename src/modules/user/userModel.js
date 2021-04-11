import mongoose from 'mongoose';
import { listRoles } from '../permission/roles';

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    timeZone: {
      type: String,
      default: 'America/Los_Angeles',
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },

    emailConfirmation: {
      hash: { type: String, select: false },
      confirmed: {
        type: Boolean,
        default: false,
      },
    },

    password: {
      type: String,
      select: false,
      required: true,
    },

    name: {
      type: String,
      unique: false,
      trim: true,
      default: '',
    },

    firstName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    lastName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    resetPassword: {
      hash: { type: String, select: false },
      date: {
        select: false,
        type: Date,
        required: false,
      },
      history: [
        {
          date: Date,
        },
      ],
    },

    roles: [
      {
        type: String,
        required: false,
        enum: listRoles,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      date: {
        type: Date,
        required: false,
        default: new Date(0),
      },
    },
  },

  { timestamps: {}, versionKey: false },
);

export default mongoose.model('User', userSchema);
