import { CreateTicketPayload, Ticket, UpdateTicketPayload } from '@piaogen/shared';
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

export function updateTicket(id: string, payload: UpdateTicketPayload) {
  return request<Ticket>(`/tickets/${id}`, {
    method: 'PATCH',
    data: payload
  });
}

export function deleteTicket(id: string) {
  return request<Ticket>(`/tickets/${id}`, {
    method: 'DELETE'
  });
}
