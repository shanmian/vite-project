import { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import { usePostApi } from '../../api/post';

const PostList = () => {
  const [page, setPage] = useState(1);
  
  const { 
    data: posts, 
    loading, 
    error,
    run: fetchPosts 
  } = usePostApi.useGetPosts();

  const {
    loading: createLoading,
    run: createPost
  } = usePostApi.useCreatePost();

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = () => {
    fetchPosts({
      params: {
        _page: page,
        _limit: 10
      }
    });
  };

  const handleCreate = async () => {
    try {
      await createPost({
        data: {
          title: '新文章',
          body: '文章内容',
          userId: 1
        }
      });
      loadPosts(); // 刷新列表
    } catch (err) {
      console.error('创建失败:', err);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">加载失败：{error.message}</Typography>
        <Button onClick={loadPosts}>重试</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">文章列表</Typography>
        <Button 
          variant="contained" 
          onClick={handleCreate}
          disabled={createLoading}
        >
          {createLoading ? '创建中...' : '新建文章'}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {posts?.map(post => (
          <Box 
            key={post.id}
            sx={{
              p: 2,
              border: '1px solid #eee',
              borderRadius: 1
            }}
          >
            <Typography variant="h6">{post.title}</Typography>
            <Typography color="text.secondary">
              {post.body.slice(0, 100)}...
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          上一页
        </Button>
        <Button 
          onClick={() => setPage(p => p + 1)}
        >
          下一页
        </Button>
      </Box>
    </Box>
  );
};

export default PostList;