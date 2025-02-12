import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { Box, TextField, Button, Card, Typography } from '@mui/material';

// 定义查询参数接口
interface SearchParams {
  keyword: string;
  page: number;
  pageSize: number;
}

// 定义返回数据接口
interface SearchResult {
  list: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  total: number;
}

const ParamsExample = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    page: 1,
    pageSize: 10
  });

  const { 
    data, 
    loading, 
    error, 
    run: search 
  } = useRequest<SearchResult>({
    url: '/api/search',
    method: 'GET',
    params: searchParams
  }, {
    manual: true,
    onSuccess: (data) => {
      console.log('搜索成功：', data);
    },
    onError: (error) => {
      console.log('搜索失败：', error);
    }
  });

  const handleSearch = () => {
    search();
  };

  const handleNextPage = () => {
    setSearchParams(prev => ({
      ...prev,
      page: prev.page + 1
    }));
    search({
      params: {
        ...searchParams,
        page: searchParams.page + 1
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="搜索关键词"
            value={searchParams.keyword}
            onChange={(e) => setSearchParams(prev => ({
              ...prev,
              keyword: e.target.value
            }))}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? '搜索中...' : '搜索'}
          </Button>
        </Box>

        {error && (
          <Typography color="error">
            搜索出错：{error.message}
          </Typography>
        )}

        {data && (
          <Box>
            <Typography variant="h6">
              搜索结果（共 {data.total} 条）
            </Typography>
            {data.list.map(item => (
              <Card key={item.id} sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle1">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Card>
            ))}
            {data.list.length < data.total && (
              <Button 
                onClick={handleNextPage}
                disabled={loading}
              >
                加载更多
              </Button>
            )}
          </Box>
        )}
      </Card>

      <Typography variant="subtitle2" color="text.secondary">
        当前参数：
        <pre>
          {JSON.stringify(searchParams, null, 2)}
        </pre>
      </Typography>
    </Box>
  );
};

export default ParamsExample;