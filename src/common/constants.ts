export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const HTTP_OK_STRING = 'ok';

export enum ERROR_MESSAGES {
  Unauthenticated = 'Invalid username and or password',
  Unauthorized = 'Insufficient permission for this request',
  UserIdNotSupplied = 'UserId Not Supplied in header',
  UserRoleNotSupplied = 'UserRole Not Supplied in header',
  SequelizeDatabaseError = 'SequelizeDatabaseError',
  InternalServerError = 'Internal Server Error',
}

export const USER_HEADERS = [
  { name: 'email', description: 'email' },
  { name: 'password', description: 'password' },
]

export const JWT_HEADERS = [
  { name: 'token', description: 'token' }
]

export const POPULATE_USER_FIELDS = 'firstname lastname role_type';

export enum RoleScopes {
  // agent
  READ_AGENT = 'read_agent',
  WRITE_AGENT = 'write_agent',
  UPDATE_AGENT = 'update_agent',
  ACTIVATE_AGENT = 'activate_agent',
  DEACTIVATE_AGENT = 'deactivate_agent',
  // customer
  READ_CUSTOMER = 'read_customer',
  // comment
  READ_COMMENT = 'read_comment',
  WRITE_COMMENT = 'write_comment',
  // ticket
  READ_TICKET = 'read_ticket',
  WRITE_TICKET = 'write_ticket',
  CLOSE_TICKET = 'close_ticket',
  UPDATE_TICKET = 'update_ticket',
  // report
  READ_REPORT = 'read_report',
};

export enum UserRoles {
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer'
}
