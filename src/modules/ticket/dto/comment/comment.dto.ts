import { BaseDto } from "src/common/dto/base.dto";
import { TicketDto } from "../ticket.dto";

export class CommentDto extends BaseDto {
  readonly ticket: string | TicketDto;
  readonly message: string;
  readonly created_by: string | any;
}
