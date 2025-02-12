import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { 
  Box, TextField, Button, Card, Typography, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

// 定义表单数据接口
interface FormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

// 定义响应数据接口
interface PostResponse {
  id: number;
  createdAt: string;
  status: 'success' | 'pending' | 'failed';
}

const PostExample = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    category: 'tech',
    tags: []
  });

  const { 
    data, 
    loading, 
    error, 
    run: submitPost 
  } = useRequest<PostResponse>({
    url: '/api/posts/create',
    method: 'POST',
    data: formData
  }, {
    manual: true,
    onSuccess: (data) => {
      console.log('发布成功：', data);
      // 清空表单
      setFormData({
        title: '',
        content: '',
        category: 'tech',
        tags: []
      });
    },
    onError: (error) => {
      console.log('发布失败：', error);
    }
  });

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.title || !formData.content) {
      alert('请填写完整信息');
      return;
    }

    await submitPost({
      data: {
        ...formData,
        publishTime: new Date().toISOString()
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          发布文章
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="标题"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              title: e.target.value
            }))}
            required
          />

          <TextField
            label="内容"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: e.target.value
            }))}
            multiline
            rows={4}
            required
          />

          <FormControl>
            <InputLabel>分类</InputLabel>
            <Select
              value={formData.category}
              label="分类"
              onChange={(e) => setFormData(prev => ({
                ...prev,
                category: e.target.value
              }))}
            >
              <MenuItem value="tech">技术</MenuItem>
              <MenuItem value="life">生活</MenuItem>
              <MenuItem value="other">其他</MenuItem>
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '发布中...' : '发布文章'}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            发布失败：{error.message}
          </Typography>
        )}

        {data && (
          <Typography color="success.main" sx={{ mt: 2 }}>
            发布成功！文章ID：{data.id}
          </Typography>
        )}
      </Card>

      <Typography variant="subtitle2" color="text.secondary">
        当前表单数据：
        <pre>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </Typography>
    </Box>
  );
};

export default PostExample;