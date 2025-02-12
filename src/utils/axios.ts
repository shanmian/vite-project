import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * API 响应数据接口
 * @template T - 响应数据类型
 */
export interface ApiResponse<T = any> {
  code: number;      // 响应状态码
  data: T;          // 响应数据
  message: string;   // 响应消息
}

/**
 * 创建 axios 实例
 * 配置基础 URL、超时时间和请求头
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 请求拦截器
 * 在请求发送前统一处理
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    // 如果存在 token，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 响应拦截器
 * 统一处理响应数据和错误
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = response.data;
    // 如果状态码不是 200，抛出错误
    if (code !== 200) {
      return Promise.reject(new Error(message || '请求失败'));
    }
    return data;
  },
  (error) => {
    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;