import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
  message: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  meta: { type: JSON }
}, { 
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  } 
});
