import { CreateTicketPayload, Ticket } from '@piaogen/shared';
import { request } from '../utils/request';

export function getTickets() {
  return request<Ticket[]>('/tickets');
}

export function getTicket(id: string) {
  return request<Ticket>(`/tickets/${id}`);
}

export function createTicket(payload: CreateTicketPayload) {
  return request<Ticket>('/tickets', {
    method: 'POST',
    data: payload
  });
}
