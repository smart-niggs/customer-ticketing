import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserModule } from 'src/modules/user/user.module';
import { Seeder } from './index.seeder';
import { RoleSeeder } from './role/roles.seeder';
import { UserSeeder } from './user/users.seeder';

@Module({
  imports: [CommandModule, UserModule],
  providers: [Seeder, RoleSeeder, UserSeeder],
  exports: [RoleSeeder],
})
export class SeederModule { }
