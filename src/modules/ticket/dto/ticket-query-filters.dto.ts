import { PartialType, PickType } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';


export class TicketQueryFiltersDto extends PartialType(PickType(TicketDto,
  [
    'priority',
    'type',
    'status',
  ] as const)) { }
  // ] as const)) implements BaseQueryFiltersDto { }
