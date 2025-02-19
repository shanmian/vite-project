import { useState, useEffect } from 'react';  // 添加 useEffect
import useRequest from '../../hooks/useRequest';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';

// 定义接口数据类型
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const RequestExample = () => {
  const [postId, setPostId] = useState(1);

  // 自动获取文章列表
  const { 
    data: posts, 
    loading: postsLoading,
    run: fetchPosts 
  } = useRequest<Post[]>({
    url: '/posts',
    method: 'GET'
  }, {
    manual: true,  // 改为手动触发
    onSuccess: (data) => {
      console.log('获取文章列表成功：', data);
    },
    onError: (error) => {
      console.log('获取文章列表失败：', error);
    }
  });

  // 添加 useEffect 自动触发请求
  useEffect(() => {
    console.log('组件挂载，获取文章列表');
    fetchPosts();
  }, []);

  // 手动获取单个文章
  const { 
    data: post, 
    loading: postLoading, 
    run: fetchPost 
  } = useRequest<Post>({
    url: `/posts/${postId}`,
    method: 'GET'
  }, { manual: true });

  // 创建新文章
  const { 
    loading: createLoading, 
    run: createPost 
  } = useRequest<Post>({
    url: '/posts',
    method: 'POST'
  }, { 
    manual: true,
    onSuccess: (data) => {
      console.log('创建成功：', data);
    }
  });

  // 处理创建文章
  const handleCreatePost = () => {
    createPost({
      data: {
        title: '新文章',
        body: '这是文章内容',
        userId: 1
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 文章列表 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>文章列表</Typography>
        {postsLoading ? (
          <CircularProgress />
        ) : (
          <Box>
            {posts?.slice(0, 5).map(post => (
              <Box key={post.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{post.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.body.slice(0, 100)}...
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* 获取单个文章 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>获取单个文章</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            type="number"
            label="文章ID"
            value={postId}
            onChange={(e) => setPostId(Number(e.target.value))}
            size="small"
          />
          <Button 
            variant="contained" 
            onClick={() => fetchPost()}
            disabled={postLoading}
          >
            获取文章
          </Button>
        </Box>
        {postLoading ? (
          <CircularProgress />
        ) : post ? (
          <Box>
            <Typography variant="h6">{post.title}</Typography>
            <Typography>{post.body}</Typography>
          </Box>
        ) : null}
      </Box>

      {/* 创建文章 */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>创建文章</Typography>
        <Button 
          variant="contained" 
          onClick={handleCreatePost}
          disabled={createLoading}
        >
          {createLoading ? '创建中...' : '创建文章'}
        </Button>
      </Box>
    </Box>
  );
};

export default RequestExample;