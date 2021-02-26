import { ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, MinLength } from 'class-validator';
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from '../constants';

export class CreateTicketDto {
  @MinLength(3)
  title: string;

  @MinLength(10)
  message: string;

  @IsEnum(TICKET_PRIORITY)
  priority?: string = TICKET_PRIORITY.Medium;

  @IsEnum(TICKET_TYPE)
  type?: string = TICKET_TYPE.Support;

  @ApiHideProperty()
  @IsEnum(TICKET_STATUS)
  status?: string = TICKET_STATUS.Open;

  @ApiHideProperty()
  created_by?: string;
}
