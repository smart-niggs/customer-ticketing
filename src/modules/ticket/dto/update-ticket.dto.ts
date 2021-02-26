import { ApiHideProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(PickType(CreateTicketDto,
  [
    'priority',
    'type',
    'status',
    'created_by'
  ] as const)) {

  @ApiHideProperty()
  updated_by?: string;
}
