import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRoles } from 'src/common/constants';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  // @IsString()
  @MinLength(2)
  firstname: string;

  @MinLength(2)
  lastname: string;

  @ApiHideProperty()
  role?: string; // role ObjectId

  @IsEnum(UserRoles, { message: `User role must be any of: ${Object.values(UserRoles)}` })
  role_type: string = UserRoles.CUSTOMER;
}
