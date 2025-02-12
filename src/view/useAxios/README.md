# Axios 请求封装使用说明
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