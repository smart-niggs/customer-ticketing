import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserRoles } from 'src/common/constants';
import { ERROR_MESSAGES, USER_MODEL } from 'src/modules/user/constants';
import { Model } from 'mongoose';
import { UserDto as User } from 'src/modules/user/dto/user.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserService } from 'src/modules/user/user.service';


describe('AuthController', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true
    }));
    await app.init();

    userModel = moduleFixture.get(USER_MODEL, { strict: false });
    userService = moduleFixture.get(UserService, { strict: false });

    // clear user collection
    await userModel.deleteMany({});
  });

  const customer: CreateUserDto = {
    "email": "smartniggs1@gmail.com",
    "firstname": "Emy",
    "lastname": "Eze",
    "password": "password",
    "role_type": 'customer'
  }

  describe('SignUp - New User', () => {
    beforeAll(async () => {
      // clear user collection before starting test
      await userModel.deleteMany({
        role_type: UserRoles.CUSTOMER
      });
    });

    it('/(auth/sign-up) it should signup a new customer', (done) => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(customer)
        .expect(201)
        .expect(({ body }) => {
          expect(body.user.email).toEqual(customer.email);
        })
        .end(done);
    });
  });

  describe('SignUp - Existing User', () => {

    beforeAll(async () => {
      try {
        const newCustomer = await userService.create(customer);
        expect(newCustomer.email).toEqual(customer.email);
      }
      catch (e) { }
    });

    it('/(sign-up) it should not signup a existing customer', async (done) => {
      const res = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(customer);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(ERROR_MESSAGES.UserAlreadyExists);
      done();
    });
  });

  describe('Login', () => {
    beforeAll(async () => {
      try {
        await userModel.deleteMany({});
        const createdUser = await userService.create(customer);
        expect(createdUser.email).toEqual(customer.email);
      }
      catch (e) { console.log(e) }
    });

    it('/(auth/login) it should login a user', async (done) => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: customer.email,
          password: 'password'
        })

      expect(res.status).toEqual(200);
      expect(res.body.user.email).toEqual(customer.email);
      expect(res.body).toHaveProperty('access_token');
      done();
    });

    it('/(auth/login) it should not login a invalid user', async (done) => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'randomeeemail',
          password: 'randdPass'
        })

      expect(res.status).toEqual(401);
      expect(res.body).not.toHaveProperty('user');
      expect(res.body).not.toHaveProperty('access_token');
      done();
    });
  });

  afterAll(async () => {
    // clear user collection
    await userModel.deleteMany({});
    await app.close();
  });
});
