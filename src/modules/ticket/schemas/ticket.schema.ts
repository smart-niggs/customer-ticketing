import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from '../constants';

export const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, required: true, enum: Object.values(TICKET_PRIORITY), default: TICKET_PRIORITY.Medium },
  type: { type: String, required: true, enum: Object.values(TICKET_TYPE), default: TICKET_TYPE.Support },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: Object.values(TICKET_STATUS), default: TICKET_STATUS.Open },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  meta: { type: JSON }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
