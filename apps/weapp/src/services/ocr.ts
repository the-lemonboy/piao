import { RecognizeTicketPayload, RecognizedTicketResult } from '@piaogen/shared';
import { request } from '../utils/request';

export function recognizeTicketImage(payload: RecognizeTicketPayload) {
  return request<RecognizedTicketResult>('/ocr/ticket', {
    method: 'POST',
    data: payload
  });
}
