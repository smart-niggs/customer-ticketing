import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model, QueryCursor } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDto as Ticket } from './dto/ticket.dto';
import { COMMENT_MODEL, ERROR_MESSAGES, TICKET_MODEL, TICKET_PRIORITY, TICKET_STATUS } from './constants';
import { pagingParser } from 'src/common/utils/paging-parser';
import { FindAllQueryInterface } from 'src/common/interface/find-query.interface';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { CommentDto as Comment } from './dto/comment/comment.dto';
import { POPULATE_USER_FIELDS, UserRoles } from 'src/common/constants';

@Injectable()
export class TicketService {
  constructor(
    @Inject(TICKET_MODEL) private readonly ticketModel: Model<Ticket>,
    @Inject(COMMENT_MODEL) private readonly commentModel: Model<Comment>
  ) { }

  private populateCommentsObj = {
    path: 'comments',
    populate: { path: 'created_by', select: POPULATE_USER_FIELDS }
  }


  async create(newTicket: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(newTicket);
    return createdTicket.save();
  }

  async findAll(params): Promise<FindAllQueryInterface<Ticket>> {
    const count = await this.ticketModel.countDocuments(params.where);
    const result = await this.ticketModel.find(params.where)
      .skip(params.skip)
      .limit(params.limit)
      .select('-__v')
      .sort(params.sort)
      .populate('Comments')
      .exec();
    const paging = pagingParser(params, count, result.length);
    return {
      paging,
      data: result
    };
  }

  async findOne(id: string): Promise<Ticket> {
    return this.ticketModel.findById(id)
      .populate(this.populateCommentsObj)
      .populate('created_by', POPULATE_USER_FIELDS)
      .select('-__v')
      .exec();
  }

  getStream(params): QueryCursor<Ticket> {
    // @ts-ignore
    return this.ticketModel.find(params.where).select('-__v -comments').populate('created_by', POPULATE_USER_FIELDS).lean().cursor().addCursorFlag('noCursorTimeout', true);
    // .populate('created_by', POPULATE_USER_FIELDS)
  }

  async updateTicketPriority(id: string, priority: TICKET_PRIORITY, updated_by: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(id);
    ticket.priority = priority;
    ticket.updated_by = updated_by;
    return ticket.save();
  }

  async closeTicket(id: string, updated_by: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(id);
    ticket.status = TICKET_STATUS.Closed;
    ticket.updated_by = updated_by;
    return ticket.save();
  }

  async addComment(newComment: CreateCommentDto, isCustomer: boolean): Promise<Comment> {
    try {
      // create comment collection if non-exisitent, required because using transactions doesn't create collectons
      await this.commentModel.db.createCollection('comments');
    } catch (e) { }


    if (!this.findOne(newComment.ticket))
      throw new BadRequestException(ERROR_MESSAGES.TicketNotFound);

    // Note that a customer can only comment on a ticket if and only if a support agent has commented on the ticket
    if (isCustomer) {
      const lastComment = await this.commentModel.findOne({
        ticket: newComment.ticket
      })
        .sort('-created_at')
        .populate('created_by');

      if (!lastComment) // no comment, i.e ticket not processed
        throw new BadRequestException(ERROR_MESSAGES.AgentCommentRequired);

      if (lastComment && lastComment.created_by.role_type != UserRoles.AGENT) // last comment wasn't an Agent's
        throw new BadRequestException(ERROR_MESSAGES.AgentCommentRequired);
    }

    const comment = new this.commentModel(newComment);

    const session = await this.commentModel.db.startSession();
    await session.withTransaction(async () => {
      await comment.save({ session: session });

      const ticket = await this.ticketModel.findById(comment.ticket).session(session);
      ticket.comments.push(comment._id);
      await ticket.save();
    });
    session.endSession();

    return comment;
  }

}
