import { Mongoose } from "mongoose";
import { UserRoles } from "src/common/constants";
import { BaseDto } from "src/common/dto/base.dto";

export class UserDto extends BaseDto {
  readonly email: string;
  readonly firstname?: string;
  readonly lastname?: string;
  readonly password: string;
  last_login_at: Date;
  readonly role_type: UserRoles;
  readonly role: any;
  readonly active: boolean;
}
