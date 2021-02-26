import * as mongoose from 'mongoose';

export const RoleSchema = new mongoose.Schema({
  name: { type: String, unique: true, enum: ['admin', 'agent', 'customer'], default: 'customer' },
  scopes: [{ type: String, required: true }],
  active: { type: Boolean, default: true },
  meta: { type: JSON }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // deletedAt: 'deleted_at'
  }
});
