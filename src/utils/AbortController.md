使用 `AbortController` 是更现代的方式来取消请求，它比 `axios.CancelToken` 更简洁且符合 Web 标准。以下是使用 `AbortController` 修改后的代码：

### 修改后的代码

```typescript
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * API 响应数据接口
 * @template T - 响应数据类型
 */
export interface ApiResponse<T = any> {
  code: number;      // 响应状态码
  data: T;          // 响应数据
  message: string;   // 响应消息
}

/**
 * 创建 axios 实例
 * 配置基础 URL、超时时间和请求头
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 用于存储每个请求的 AbortController
const controllerMap = new Map<string, AbortController>();

/**
 * 生成请求的唯一标识
 * @param config - 请求配置
 * @returns 请求的唯一标识
 */
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  return `${config.method}-${config.url}`;
};

/**
 * 请求拦截器
 * 在请求发送前统一处理
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    // 如果存在 token，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 生成请求的唯一标识
    const requestKey = generateRequestKey(config);

    // 如果请求已经存在，则取消之前的请求
    if (controllerMap.has(requestKey)) {
      const controller = controllerMap.get(requestKey);
      controller?.abort('请求被取消，因为发起了新的相同请求');
      controllerMap.delete(requestKey);
    }

    // 创建新的 AbortController
    const controller = new AbortController();
    config.signal = controller.signal;

    // 存储 AbortController
    controllerMap.set(requestKey, controller);

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 响应拦截器
 * 统一处理响应数据和错误
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message } = response.data;
    // 如果状态码不是 200，抛出错误
    if (code !== 200) {
      return Promise.reject(new Error(message || '请求失败'));
    }

    // 请求成功，移除对应的 AbortController
    const requestKey = generateRequestKey(response.config);
    controllerMap.delete(requestKey);

    return data;
  },
  (error) => {
    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // 请求失败，移除对应的 AbortController
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      controllerMap.delete(requestKey);
    }

    return Promise.reject(error);
  }
);

export default instance;
```

---

### 关键点解释

1. **`AbortController`**:
   - `AbortController` 是一个 Web 标准 API，用于取消请求。
   - 通过 `controller.abort()` 可以取消请求。
   - 将 `controller.signal` 赋值给 `config.signal`，axios 会自动处理取消逻辑。

2. **`controllerMap`**:
   - 用于存储每个请求的唯一标识和对应的 `AbortController`。
   - 当发起新请求时，检查是否已经存在相同的请求。如果存在，则取消之前的请求。

3. **`generateRequestKey`**:
   - 生成请求的唯一标识，基于请求的 `method` 和 `url`。
   - 例如：`GET-/api/user`。

4. **请求拦截器**:
   - 在请求发送前，检查是否已经存在相同的请求。
   - 如果存在，则取消之前的请求，并创建新的 `AbortController`。

5. **响应拦截器**:
   - 在请求成功或失败后，移除对应的 `AbortController`。

---

### 优点
- **更现代**：`AbortController` 是 Web 标准，比 `axios.CancelToken` 更推荐使用。
- **更简洁**：不需要额外引入 `CancelToken`，直接使用 `AbortController` 即可。
- **兼容性**：现代浏览器和 Node.js 都支持 `AbortController`。

---

### 示例用法

```typescript
import api from './api';

// 发起请求
api.get('/user')
  .then((data) => {
    console.log('请求成功:', data);
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log('请求被取消:', error.message);
    } else {
      console.log('请求失败:', error.message);
    }
  });

// 再次发起相同请求（之前的请求会被取消）
api.get('/user')
  .then((data) => {
    console.log('新的请求成功:', data);
  })
  .catch((error) => {
    if (axios.isCancel(error)) {
      console.log('新的请求被取消:', error.message);
    } else {
      console.log('新的请求失败:', error.message);
    }
  });
```

---

通过这种方式，可以确保在发起相同请求时，之前的请求会被取消，避免重复请求。
