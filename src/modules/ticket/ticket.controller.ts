import { Body, Controller, Get, Header, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as csvWriter from 'csv-write-stream';
import * as lodash from 'lodash';
import { Response } from 'express';
import { DateTime } from 'luxon';
import { RoleScopes, UserRoles } from 'src/common/constants';
import { UserDecorator as GetUser } from 'src/common/decorator/user.decorator';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TICKET_PRIORITY } from './constants';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketQueryFiltersDto } from './dto/ticket-query-filters.dto';
import { TicketService } from './ticket.service';


@Controller('tickets')
@ApiTags('Ticket')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketController {

  constructor(private readonly ticketService: TicketService) { }

  @Post()
  @Roles(RoleScopes.WRITE_TICKET)
  async createTicket(
    @Body() newTicket: CreateTicketDto,
    @GetUser('id') userId
  ) {
    newTicket.created_by = userId;
    return this.ticketService.create(newTicket);
  }

  @Post('comment')
  @Roles(RoleScopes.WRITE_COMMENT)
  async addComment(
    @Body() newComment: CreateCommentDto,
    @GetUser() user
  ) {
    newComment.created_by = user.id;
    const isCustomer = user.role_type == 'customer' ? true : false;

    return this.ticketService.addComment(newComment, isCustomer);
  }

  @Get()
  @Roles(RoleScopes.READ_TICKET)
  async findAll(
    @Query() queryFilter: TicketQueryFiltersDto,
    @GetUser() user
  ) {
    const query = parseQueryObj(queryFilter, ['type', 'priority', 'status', 'created_by']);

    // ensure restricted access to data
    if (user.role == UserRoles.CUSTOMER)
      query.where.created_by = user.id;

    return this.ticketService.findAll(query);
  }

  @Get('report')
  @Roles(RoleScopes.READ_REPORT)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename=report.csv')
  async getReport(
    @Res() res: Response,
    @Query() queryFilter: TicketQueryFiltersDto
  ) {
    const query = parseQueryObj(queryFilter, ['type', 'priority', 'status', 'created_by']);
    query.where.created_at = this.getReportDateQuery();

    const writer = csvWriter({
      headers:
        ["firstname", "lastname", "role_type", "title", "message", "priority", "type", "status", "_id", "created_at", "updated_at"]
    });

    const ticketStream = this.ticketService.getStream(query);
    writer.pipe(res);

    ticketStream.on('data', (chunk) => {
      chunk = lodash.merge(chunk, chunk.created_by);
      delete chunk.created_by;

      writer.write(chunk);
    });

    ticketStream.on('close', () => writer.end());
  }


  @Get(':id')
  @Roles(RoleScopes.READ_TICKET)
  async findOne(
    @Param('id') id: string,
  ) {
    return this.ticketService.findOne(id);
  }

  @Patch('close/:id')
  @Roles(RoleScopes.UPDATE_TICKET)
  async closeTicket(
    @Param('id') id: string,
    @GetUser('id') userId
  ) {
    return this.ticketService.closeTicket(id, userId);
  }


  @Patch('priority/:id')
  @Roles(RoleScopes.UPDATE_TICKET)
  async updatePriority(
    @Param('id') id: string,
    @Body('priority') priority: TICKET_PRIORITY,
    @GetUser('id') userId
  ) {
    return this.ticketService.updateTicketPriority(id, priority, userId);
  }

  private getReportDateQuery() {
    const startDate = DateTime.now().minus({ months: 1 }).toISO();

    return {
      $gte: new Date(startDate).toISOString(),
      $lte: new Date().toISOString()
    };
  }
}
