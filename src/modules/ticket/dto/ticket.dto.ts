import { BaseDto } from "src/common/dto/base.dto";
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from "../constants";

export class TicketDto extends BaseDto {
  readonly title: string;
  readonly message: string;
  priority: TICKET_PRIORITY;
  readonly type: TICKET_TYPE;
  status: TICKET_STATUS;
  readonly created_by: string;
  updated_by: string;
  comments: [string];
}
