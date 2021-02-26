import { PartialType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';


export class UserQueryFiltersDto extends PartialType(PickType(UserDto,
  [
    'email',
    'firstname',
    'lastname',
    'role',
  ] as const)) { }
