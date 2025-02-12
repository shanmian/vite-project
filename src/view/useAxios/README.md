# Axios 请求封装使用说明
## 参数说明
### config: AxiosRequestConfig
请求配置对象，支持所有 axios 配置项：
{
  url: string;          // 请求地址
  method?: string;      // 请求方法
  params?: object;      // URL 参数
  data?: any;           // 请求体数据
  headers?: object;     // 请求头
  timeout?: number;     // 超时时间
}
## options: RequestOptions
1. 可选的配置项：
{
  manual?: boolean;      // 是否手动触发请求，默认 false
  onSuccess?: (data: T) => void;    // 请求成功回调
  onError?: (error: Error) => void;  // 请求失败回调
  initialData?: T | null;    // 初始数据
}
2. 返回值说明
{
  data: T | null;        // 响应数据
  loading: boolean;      // 加载状态
  error: Error | null;   // 错误信息
  run: (config?: AxiosRequestConfig) => Promise<void>;  // 执行请求方法
  reset: () => void;     // 重置状态方法
}
## 使用方法
1. 基础使用
const { data, loading, error } = useRequest<UserInfo>({
  url: '/user/info',
  method: 'GET'
});
2. 手动触发
```
const { run, data } = useRequest({
  url: '/api/data',
  method: 'GET'
}, {
  manual: true
});

// 手动调用
run();
```
3. 带参数请求
```
const { run } = useRequest({
  url: '/api/search',
  method: 'GET',
  params: {
    keyword: 'test',
    page: 1
  }
});
```
4. POST 请求
```
const { run } = useRequest({
  url: '/api/create',
  method: 'POST',
  data: {
    name: '张三',
    age: 18
  }
});
```
5. 处理响应
```
const { data, loading, error } = useRequest({
  url: '/api/data'
}, {
  onSuccess: (data) => {
    console.log('请求成功：', data);
  },
  onError: (error) => {
    console.log('请求失败：', error);
  }
});
```
6. 重置状态
```
const { reset } = useRequest({
  url: '/api/data'
});

// 重置所有状态
reset();
```
7. 带初始数据的请求
```
const { data } = useRequest({
  url: '/api/user'
}, {
  initialData: { name: '默认用户' }
});
```

## 注意事项
1. 自动发起请求
- 默认情况下，请求会在组件挂载时自动发起
- 设置 manual: true 可以手动控制请求时机
2. 错误处理
- error 状态会自动捕获并处理请求错误
- 可以通过 onError 回调自定义错误处理
3. 类型支持
- 支持泛型定义返回数据类型
- 建议明确指定数据类型以获得更好的类型提示
4. 状态管理
- loading 状态会在请求开始时自动设置
- 可以通过 reset 方法重置所有状态
5. 配置合并
- run 方法支持传入新的配置，会与初始配置合并
- 新配置优先级高于初始配置

## 解释
- 职责分离 ：

- axios 实例配置文件负责基础配置和拦截器
- useRequest 负责状态管理和请求封装
- 复用性 ：

- 实例配置可以被多个 hooks 或组件共享
- useRequest 可以专注于数据获取逻辑
- 维护性 ：

- 全局配置统一管理
- 请求拦截和响应拦截集中处理
- 扩展性 ：

- 可以创建多个不同配置的实例
- useRequest 可以根据需要选择不同的实例