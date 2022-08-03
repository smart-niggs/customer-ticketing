# **Customer Support Ticketing System**.
This app can be used by the customer success team of an organisation to efficiently manage customer requests.

Backend APIs for customer support ticketing system.
The functional requirements are:
- Customers should be able to:
  - create tickets on the system.
  - view tickets created by them.
  - view responses to tickets created by them.
- Admin should be able to:
  - create & manage all agents on the system.
  - view all tickets in the system.
  - respond to any ticket, even if it has been assigned to an agent.
- Agents will have the ability to:
  - View all pending tickets ie. tickets that have not been attended to.
  - Pick and respond to selected tickets, when a ticket has been treated by an agent, it is assigned to that agent and only that agent can respond to it.


### Check out the API by clicking the following links:
-  #### [Deployed API URL]()
-  #### [Postman Doc]()
- #### [Swagger Doc]()
<br />

### Description
-  Built using [Nest](https://github.com/nestjs/nest) framework.

<br />

## Installation
```bash
$ npm install
```

## Running the app
- #### Seed data to database
```bash
$ npm run seeder
```
- #### start app
```bash
$ npm run start
```

## Test
### e2e tests
```bash
$ npm run test
```

