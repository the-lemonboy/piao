import type { DailyQuote } from '@piaogen/shared';
import { request } from '../utils/request';

export function getLatestDailyQuote() {
  return request<DailyQuote | null>('/daily-quotes/latest');
}
