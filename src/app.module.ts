import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AllExceptionsFilter } from './common/exception/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { SeederModule } from './database/seeders/seeder.module';
import { TicketModule } from './modules/ticket/ticket.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TicketModule,
    SeederModule
  ],
  providers: [AllExceptionsFilter],
  controllers: [AppController]
})
export class AppModule { }
