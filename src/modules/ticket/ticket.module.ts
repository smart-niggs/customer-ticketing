import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketProviders } from './ticket.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketController],
  providers: [TicketService, ...TicketProviders],
  exports: [TicketService]
})
export class TicketModule {}
