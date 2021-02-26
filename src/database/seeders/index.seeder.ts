import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RoleSeeder } from './role/roles.seeder';
import { UserSeeder } from './user/users.seeder';

@Injectable()
export class Seeder {
  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly userSeeder: UserSeeder
  ) { }

  @Command({ command: 'seeders:all', describe: 'Run All Seeders', autoExit: false })
  async runAllSeeders() {
    console.log('Starting Seeder..');

    // create roles
    await this.roleSeeder.createRoles();
    // create users
    await this.userSeeder.createUsers();

    console.log('Seeders Completed!');
  }
}
