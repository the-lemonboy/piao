import { TICKET_CATEGORIES } from './constants';
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
export interface Ticket {
    id: string;
    title: string;
    venue: string;
    eventDate: string;
    category: TicketCategory;
    imageUrl?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}
export interface DailyQuote {
    id: string;
    quoteDate: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateTicketPayload {
    title: string;
    venue: string;
    eventDate: string;
    category: TicketCategory;
    imageUrl?: string;
    note?: string;
}
export interface ApiResponse<T> {
    data: T;
    message?: string;
}
