import { AuthSession, UpdateUserProfilePayload, WechatLoginPayload } from '@piaogen/shared';
import { request } from '../utils/request';

export const AUTH_TOKEN_KEY = 'piaogen_auth_token';

export function loginWithWechat(payload: WechatLoginPayload) {
  return request<AuthSession>('/auth/wechat/login', {
    method: 'POST',
    data: payload
  });
}

export function getMe() {
  return request<AuthSession>('/auth/me');
}

export function updateProfile(payload: UpdateUserProfilePayload) {
  return request<AuthSession>('/auth/me', {
    method: 'PATCH',
    data: payload
  });
}

export function logout() {
  return request<boolean>('/auth/logout', {
    method: 'POST'
  });
}
