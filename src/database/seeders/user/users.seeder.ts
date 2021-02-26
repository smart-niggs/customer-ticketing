import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import * as UsersData from './users.data.json';
import { UserService } from 'src/modules/user/user.service';
import { UserRoles } from 'src/common/constants';

@Injectable()
export class UserSeeder {
  constructor(private readonly userService: UserService) { }

  @Command({ command: 'seeders:users', describe: 'create users', autoExit: false })
  async createUsers() {
    try {
      const userRoles: string[] = Object.values(UserRoles);

      for (const key in UsersData) {
        if (!(key && userRoles.includes(key) && UsersData[key]))
          throw new Error('invald user seeding data');

        const user = await this.userService.findOneByEmail(UsersData[key].email);
        if (user && user.id) {
          continue;
        }

        const createdUser = await this.userService.create(UsersData[key]);
        console.log(`${createdUser.role_type} created: ${createdUser.email}`);
      }
      console.log('All users seeded');
    }
    catch (error) {
      console.error('user seeder error: ' + error)
    }
  }
}

// to run this seeder only, use: npx nestjs-command seeders:users
