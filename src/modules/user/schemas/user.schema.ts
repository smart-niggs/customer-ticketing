import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { UserRoles } from 'src/common/constants';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String, required: true },
  last_login_at: { type: Date },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  role_type: { type: String, enum: Object.values(UserRoles), default: UserRoles.CUSTOMER }, // denormalized from role
  active: { type: Boolean, default: true },
  meta: { type: JSON }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

// index the email, firstname, lastname,
