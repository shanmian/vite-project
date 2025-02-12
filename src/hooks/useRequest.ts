import { useState, useCallback } from 'react';
import type { AxiosRequestConfig } from 'axios';
import axiosInstance from '../utils/axios';

// 请求配置选项接口
interface RequestOptions<T> {
  manual?: boolean;      // 是否手动触发请求
  onSuccess?: (data: T) => void;    // 请求成功回调
  onError?: (error: Error) => void;  // 请求失败回调
  initialData?: T | null;    // 初始数据
}

// 请求结果接口
interface RequestResult<T> {
  data: T | null;        // 响应数据
  loading: boolean;      // 加载状态
  error: Error | null;   // 错误信息
  run: (config?: AxiosRequestConfig) => Promise<void>;  // 执行请求方法
  reset: () => void;     // 重置状态方法
}

/**
 * 通用请求 Hook
 * @param config - axios 请求配置
 * @param options - 请求选项
 * @returns 请求结果对象
 */
function useRequest<T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions<T> = {}
): RequestResult<T> {
  // 解构配置选项，设置默认值
  const { 
    manual = false,      // 是否手动触发
    onSuccess,           // 成功回调
    onError,            // 失败回调
    initialData = null  // 初始数据
  } = options;

  // 状态管理
  const [loading, setLoading] = useState(!manual);  // 加载状态
  const [data, setData] = useState<T | null>(initialData);  // 数据状态
  const [error, setError] = useState<Error | null>(null);   // 错误状态

  /**
   * 执行请求方法
   * @param runConfig - 可选的运行时配置，会与初始配置合并
   */
  const run = useCallback(async (runConfig?: AxiosRequestConfig) => {
    const finalConfig = { ...config, ...runConfig };
    setLoading(true);
    setError(null);
    
    try {
      const res = await axiosInstance.request<T>(finalConfig);
      setData(res as T);
      onSuccess?.(res as T);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('请求失败');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [config, onSuccess, onError]);

  /**
   * 重置所有状态到初始值
   */
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { data, loading, error, run, reset };
}

export default useRequest;