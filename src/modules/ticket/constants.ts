export const TICKET_MODEL = 'TICKET_MODEL';
export const COMMENT_MODEL = 'COMMENT_MODEL';

export enum ERROR_MESSAGES {
  TicketNotFound = 'Ticket Not Found',
  TicketAlreadyExists = 'Ticket Already Exists',
  AgentCommentRequired = 'Agent has to reply ticket/comment before you can comment'
}

export enum TICKET_PRIORITY {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export enum TICKET_TYPE {
  Billing = 'billing',
  Support = 'support'
}

export enum TICKET_STATUS {
  Open = 'open',
  Closed = 'closed'
}
