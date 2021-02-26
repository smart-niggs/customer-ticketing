import { ApiHideProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateCommentDto {
  @MinLength(3)
  ticket: string;

  @MinLength(10)
  message: string;

  @ApiHideProperty()
  created_by?: string;
}
