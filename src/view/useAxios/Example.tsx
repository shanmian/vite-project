import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';

// 定义接口返回数据类型
interface UserInfo {
  id: number;
  name: string;
  email: string;
}

const UserExample = () => {
  // 基础用法
  const { data, loading, error } = useRequest<UserInfo>({
    url: '/todos/1',
    method: 'GET'
  });

  // 手动触发用法
  const { 
    data: userData, 
    loading: userLoading, 
    error: userError, 
    run: fetchUser,
    reset: resetUser
  } = useRequest<UserInfo>({
    url: '/posts',
    method: 'GET'
  }, {
    manual: true,
    onSuccess: (data) => {
      console.log('获取用户信息成功：', data);
    },
    onError: (error) => {
      console.log('获取用户信息失败：', error);
    }
  });

  // POST 请求示例
  const { run: updateUser } = useRequest({
    url: '/user/update',
    method: 'POST'
  }, { manual: true });

  // 处理用户更新
  const handleUpdateUser = async () => {
    await updateUser({
      data: {
        name: '张三',
        email: 'zhangsan@example.com'
      }
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading || userLoading) {
    return <div>加载中...</div>;
  }

  if (error || userError) {
    return <div>加载失败</div>;
  }

  return (
    <div>
      {/* 展示自动获取的数据 */}
      <div>
        <h3>自动获取的用户信息：</h3>
        {data && (
          <ul>
            <li>ID：{data.id}</li>
            <li>姓名：{data.name}</li>
            <li>邮箱：{data.email}</li>
          </ul>
        )}
      </div>

      {/* 展示手动获取的数据 */}
      <div>
        <h3>手动获取的用户信息：</h3>
        {userData && (
          <ul>
            <li>ID：{userData.id}</li>
            <li>姓名：{userData.name}</li>
            <li>邮箱：{userData.email}</li>
          </ul>
        )}
      </div>

      {/* 操作按钮 */}
      <div>
        <button onClick={() => fetchUser()}>刷新数据</button>
        <button onClick={resetUser}>重置数据</button>
        <button onClick={handleUpdateUser}>更新用户</button>
      </div>
    </div>
  );
};

export default UserExample;