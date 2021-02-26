// the files enables commands run from terminal to mapped to certain app related activities. e.g Seeders

import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false
  });
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
})();
