import Taro from '@tarojs/taro';
import { ApiResponse } from '@piaogen/shared';

declare const API_BASE_URL: string;

type RequestOptions = Omit<Taro.request.Option, 'url' | 'success' | 'fail'>;

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = Taro.getStorageSync('piaogen_auth_token');
  const response = await Taro.request<ApiResponse<T>>({
    ...options,
    url: `${API_BASE_URL}${path}`,
    header: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.header
    }
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(response.data?.message || `Request failed: ${response.statusCode}`);
  }

  return response.data.data;
}
