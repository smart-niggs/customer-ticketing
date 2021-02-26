import { Mongoose } from "mongoose";
import { BaseDto } from "src/common/dto/base.dto";

export class RoleDto extends BaseDto {
  readonly name: string;
  readonly scopes?: string[];
  readonly active: boolean;
}
