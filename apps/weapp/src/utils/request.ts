import Taro from '@tarojs/taro';
import type { ApiResponse } from '@piaogen/shared';

declare const API_BASE_URL: string;
declare const CLOUD_CONTAINER_ENV: string;
declare const CLOUD_CONTAINER_SERVICE: string;
declare const CLOUD_CONTAINER_API_PREFIX: string;
declare const wx: {
  cloud?: {
    callContainer?: (options: {
      config: {
        env: string;
      };
      path: string;
      header?: Record<string, string>;
      method?: string;
      data?: unknown;
      success: (response: CloudContainerResponse) => void;
      fail: (error: Error) => void;
    }) => void;
  };
};

type RequestOptions = Omit<Taro.request.Option, 'url' | 'success' | 'fail'>;
type CloudContainerResponse = {
  statusCode: number;
  data?: ApiResponse<unknown>;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = Taro.getStorageSync('piaogen_auth_token');

  if (typeof wx !== 'undefined' && wx.cloud?.callContainer && CLOUD_CONTAINER_ENV && CLOUD_CONTAINER_SERVICE) {
    return requestWithCloudContainer<T>(path, options, token);
  }

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

function requestWithCloudContainer<T>(path: string, options: RequestOptions, token: string): Promise<T> {
  return new Promise((resolve, reject) => {
    wx.cloud?.callContainer?.({
      config: {
        env: CLOUD_CONTAINER_ENV
      },
      path: `${CLOUD_CONTAINER_API_PREFIX}${path}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'content-type': 'application/json',
        'X-WX-SERVICE': CLOUD_CONTAINER_SERVICE,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header as Record<string, string> | undefined)
      },
      success: (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(response.data?.message || `Request failed: ${response.statusCode}`));
          return;
        }

        resolve(response.data?.data as T);
      },
      fail: reject
    });
  });
}
