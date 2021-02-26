import { Command } from 'nestjs-command';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import  * as RolesData from './roles.data.json';
import { RoleDto as Role } from 'src/modules/user/dto/role/role.dto';
import { ROLES_MODEL } from 'src/modules/user/constants';

@Injectable()
export class RoleSeeder {
  constructor(@Inject(ROLES_MODEL) private readonly rolesModel: Model<Role>) { }

  @Command({ command: 'seeders:roles', describe: 'create roles', autoExit: false })
  async createRoles() {
    try {
      const createdRoles: any | Role[] = await this.rolesModel.insertMany(RolesData.roles, { ordered: true });

      createdRoles.map(role => `role: ${role.name} added`);
      console.log('All roles seeded');
    }
    catch (error) {
      // console.error('roles seeder error: ' + error)
    }
  }
}

// to run this seeder only, use: npx nestjs-command seeders:roles
