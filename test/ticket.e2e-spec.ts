import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TicketService } from 'src/modules/ticket/ticket.service';
import * as UsersData from 'src/database/seeders/user/users.data.json';
import { UserDto as User } from 'src/modules/user/dto/user.dto';
import { Model } from 'mongoose';
import { AppModule } from 'src/app.module';
import { USER_MODEL } from 'src/modules/user/constants';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { CreateTicketDto } from 'src/modules/ticket/dto/create-ticket.dto';
import { TICKET_MODEL, TICKET_PRIORITY, TICKET_STATUS } from 'src/modules/ticket/constants';
import { TicketDto as Ticket } from 'src/modules/ticket/dto/ticket.dto';


describe.skip('Ticket', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let ticketModel: Model<Ticket>;
  let authService: AuthService;
  let userService: UserService;
  let ticketService: TicketService;
  let accessTokens;

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
    ticketModel = moduleFixture.get(TICKET_MODEL, { strict: false });
    authService = moduleFixture.get(AuthService, { strict: false });
    userService = moduleFixture.get(UserService, { strict: false });
    ticketService = moduleFixture.get(TicketService, { strict: false });

    await ticketModel.deleteMany({});
    accessTokens = await setupUsers(authService, userService, userModel);
    console.log('users in ticket.spec: ' + JSON.stringify(await userModel.find({})));
  });

  const ticket1: CreateTicketDto = {
    "title": "First Ticket",
    "message": "message for 1st ticket",
    "priority": TICKET_PRIORITY.Medium
  }
  const comment1 = {
    "message": "Agent reply for 1st ticket"
  }

  describe('Create New Ticket', () => {
    beforeAll(async () => {
      // clear ticket collection before starting test
      await ticketModel.deleteMany({});
    });

    it('/(tickets/) it should create a new ticket', (done) => {

      // USE THIS INSTEAD!!!!
      // const res = await request(app.getHttpServer())
      //   .get(`/${item}/quantity`);
      // expect(res.status).toEqual(200);
      // expect(res.body).toHaveProperty('quantity');
      // expect(res.body).toHaveProperty('validTill');
      // done();


      // DON  NOT USE
      return request(app.getHttpServer())
        .post('/tickets')
        .auth(accessTokens.customer, { type: 'bearer' })
        .send(ticket1)
        .expect(201)
        .expect(({ body }) => {
          expect(body.title).toEqual(ticket1.title);
          expect(body.status).toEqual(TICKET_STATUS.Open);
        })
        .end(done);
    });
  });

  describe('Add Comment to Ticket', () => {
    let createdTicket: Ticket;

    beforeAll(async () => {
      try {
        createdTicket = await ticketService.create(ticket1);
        expect(createdTicket.title).toEqual(ticket1.title);
      }
      catch (e) { }
    });

    it('/(tickets/comment) customer should not add comment to a ticket, until an agent has responded to it', (done) => {
      return request(app.getHttpServer())
        .post('/tickets/comment')
        .auth(accessTokens.customer, { type: 'bearer' })
        .send({
          ticket: createdTicket.id,
          message: comment1.message
        })
        .expect(400)
        .expect(({ body }) => {
          expect(body).not.toHaveProperty('ticket');
        })
        .end(done);
    });

    it('/(tickets/comment) agent should add comment to a ticket', (done) => {
      return request(app.getHttpServer())
        .post('/tickets/comment')
        .auth(accessTokens.agent, { type: 'bearer' })
        .send({
          ticket: createdTicket.id,
          message: comment1.message
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body.ticket).toEqual(createdTicket.id);
        })
        .end(done);
    });
  });

  describe('Get All Tickets', () => {
    let createdTicket: Ticket;

    beforeAll(async () => {
      try {
        createdTicket = await ticketService.create(ticket1);
        expect(createdTicket.title).toEqual(ticket1.title);
      }
      catch (e) { }
    });

    it('/(tickets) customer should get all tickets', (done) => {
      return request(app.getHttpServer())
        .get('/tickets')
        .auth(accessTokens.customer, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('data');
          expect(body).toHaveProperty('paging');
        })
        .end(done);
    });

    it('/(tickets) agent should get all ticket', (done) => {
      return request(app.getHttpServer())
        .get('/tickets')
        .auth(accessTokens.agent, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('data');
          expect(body).toHaveProperty('paging');
        })
        .end(done);
    });

    it('/(tickets) admin should get all ticket', (done) => {
      return request(app.getHttpServer())
        .get('/tickets')
        .auth(accessTokens.admin, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('data');
          expect(body).toHaveProperty('paging');
        })
        .end(done);
    });

  });

  describe('Get One Ticket', () => {
    let createdTicket: Ticket;

    beforeAll(async () => {
      try {
        await ticketModel.deleteMany({});
        createdTicket = await ticketService.create(ticket1);
        expect(createdTicket.title).toEqual(ticket1.title);
      }
      catch (e) { }
    });

    it('/(tickets) customer should get one ticket', (done) => {
      return request(app.getHttpServer())
        .get(`/tickets/${createdTicket.id}`)
        .auth(accessTokens.customer, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body._id).toEqual(createdTicket.id);
        })
        .end(done);
    });

    it('/(tickets) agent should get one ticket', (done) => {
      return request(app.getHttpServer())
        .get(`/tickets/${createdTicket.id}`)
        .auth(accessTokens.agent, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body._id).toEqual(createdTicket.id);
        })
        .end(done);
    });

    it('/(tickets) admin should get one ticket', (done) => {
      return request(app.getHttpServer())
        .get(`/tickets/${createdTicket.id}`)
        .auth(accessTokens.admin, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body._id).toEqual(createdTicket.id);
        })
        .end(done);
    });
  });

  describe('Close Ticket', () => {
    let createdTicket: Ticket;

    beforeAll(async () => {
      try {
        createdTicket = await ticketService.create(ticket1);
        expect(createdTicket.title).toEqual(ticket1.title);
      }
      catch (e) { }
    });

    it('/(tickets/comment) customer should be able to close ticket', (done) => {
      return request(app.getHttpServer())
        .patch(`/tickets/close/${createdTicket.id}`)
        .auth(accessTokens.customer, { type: 'bearer' })
        .expect(401)
        .end(done);
    });

    it('/(tickets/comment) agent should be able to close ticket', (done) => {
      return request(app.getHttpServer())
        .patch(`/tickets/close/${createdTicket.id}`)
        .auth(accessTokens.agent, { type: 'bearer' })
        .expect(200)
        .expect(({ body }) => {
          expect(body._id).toEqual(createdTicket.id);
        })
        .end(done);
    });

  });

  describe('Update Ticket Priority', () => {
    let createdTicket: Ticket;

    beforeAll(async () => {
      try {
        createdTicket = await ticketService.create(ticket1);
        expect(createdTicket.title).toEqual(ticket1.title);
      }
      catch (e) { }
    });

    it('/(tickets/priority) agent should be able to update ticket priority', (done) => {
      return request(app.getHttpServer())
        .patch(`/tickets/priority/${createdTicket.id}`)
        .auth(accessTokens.admin, { type: 'bearer' })
        .expect(200)
        .send({
          "priority": TICKET_PRIORITY.High
        })
        .expect(({ body }) => {
          expect(body.priority).toEqual(TICKET_PRIORITY.High);
        })
        .end(done);
    });

    it('/(tickets/priority) admin should be able to update ticket priority', (done) => {
      return request(app.getHttpServer())
        .patch(`/tickets/priority/${createdTicket.id}`)
        .auth(accessTokens.agent, { type: 'bearer' })
        .expect(200)
        .send({
          "priority": TICKET_PRIORITY.Low
        })
        .expect(({ body }) => {
          expect(body.priority).toEqual(TICKET_PRIORITY.Low);
        })
        .end(done);
    });

    it('/(tickets/priority) customer should not be able to update ticket priority', (done) => {
      return request(app.getHttpServer())
        .patch(`/tickets/priority/${createdTicket.id}`)
        .auth(accessTokens.customer, { type: 'bearer' })
        .expect(401)
        .end(done);
    });

  });

  afterAll(async () => {
    await userModel.deleteMany({});
    await ticketModel.deleteMany({});
    await app.close();
  });
});


const setupUsers = async (authService: AuthService, usersService: UserService, userModel: Model<User>) => {
  try {
    // clear user collection
    await userModel.deleteMany({});
    // create users
    const customer = await usersService.create(UsersData.customer);
    const agent = await usersService.create(UsersData.agent);
    const admin = await usersService.create(UsersData.admin);

    const customerToken = await (await (authService.login(customer))).access_token;
    const agentToken = await (await (authService.login(agent))).access_token;
    const adminToken = await (await authService.login(admin)).access_token;

    expect(customerToken).toBeDefined();
    expect(agentToken).toBeDefined();
    expect(adminToken).toBeDefined();

    return {
      customer: customerToken,
      agent: agentToken,
      admin: adminToken
    };
  }
  catch (e) { console.log(e) }
}
