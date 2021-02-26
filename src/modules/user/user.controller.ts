import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleScopes, UserRoles } from 'src/common/constants';
import { UserDecorator as GetUser } from 'src/common/decorator/user.decorator';
import { parseQueryObj } from 'src/common/utils/query-parser';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserQueryFiltersDto } from './dto/user-query-filters.dto';
import { UserService } from './user.service';


@Controller('users')
@ApiTags('User')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleScopes.READ_AGENT, RoleScopes.READ_CUSTOMER)
  async findAll(
    @Query() queryFilter: UserQueryFiltersDto,
    @GetUser('role_type') userRole: UserRoles,
    @Request() req
  ) {
    console.log('req.user: ' + JSON.stringify(req.user));
    console.log('userRole: ' + userRole);
    const query = parseQueryObj(queryFilter, ['created_by']);

    // ensure controlled access to data
    switch (userRole) {
      case UserRoles.ADMIN:
        break;
      case UserRoles.AGENT:
        query.where.role_type = UserRoles.CUSTOMER;
        break;
      default:
        break;
    }

    return this.userService.findAll(query);
  }

  @Get('my-profile')
  async myProfile(
    @GetUser('id') userId: string
  ) {
    return this.userService.findOne(userId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleScopes.READ_AGENT, RoleScopes.READ_CUSTOMER)
  async findOne(
    @Param('id') id: string,
    // @GetUser('role') userRole: UserRoles
  ) {

    return this.userService.findOne(id);
  }
}
