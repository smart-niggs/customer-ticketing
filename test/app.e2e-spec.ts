import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { configService } from 'src/common/config/config.service';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) - it should get Index API', (done) => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(`You have reached ${configService.getAppName().toUpperCase()} routes.`)
      .end(done);
  });

  afterAll(async () => {
    await app.close();
  });
});
