import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';

// axiosインスタンスの作成
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8088/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // 認証トークンの追加などが必要な場合
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('認証エラー');
      // ログインページへリダイレクトなど
    }
    return Promise.reject(error);
  }
);

// 汎用リクエストメソッド
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('APIリクエスト失敗:', error);
    throw error;
  }
};

// APIレスポンス形式を返すラッパー
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const data = await request<T>(config);
    return { success: true, data };
  } catch (error) {
    const message = (error as AxiosError<any>).response?.data?.message || 
                    (error as Error).message || 
                    'エラーが発生しました';
    return { success: false, data: {} as T, message };
  }
};

export default api;