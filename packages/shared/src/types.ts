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

export interface UserProfile {
  id: string;
  openId: string;
  nickname: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthday?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalTickets: number;
  cities: number;
  days: number;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  stats: UserStats;
}

export interface WechatLoginPayload {
  code: string;
  nickname?: string;
  avatarUrl?: string;
}

export interface UpdateUserProfilePayload {
  nickname?: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthday?: string;
  bio?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
