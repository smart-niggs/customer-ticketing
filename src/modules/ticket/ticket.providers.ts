import { Mongoose } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/common/constants';
import { COMMENT_MODEL, TICKET_MODEL } from './constants';
import { CommentSchema } from './schemas/comment.schema';
import { TicketSchema } from './schemas/ticket.schema';

export const TicketProviders = [
  {
    provide: TICKET_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('Ticket', TicketSchema),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: COMMENT_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('Comment', CommentSchema),
    inject: [DATABASE_CONNECTION],
  },
];
