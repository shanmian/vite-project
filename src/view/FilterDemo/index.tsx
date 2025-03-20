import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import FilterDrawer from '../../components/FilterDrawer';

const FilterDemo = () => {
  // 示例筛选条件
  const filters = [
    {
        id: 'tags',
        label: '标签',
        type: 'list',
        listOptions: Array.from({ length: 15 }, (_, i) => ({
          id: `tag-${i + 1}`,
          label: `标签 ${i + 1}`
        }))
      },
      {
        id: 'tags2',
        label: '标签2',
        type: 'list',
        listOptions: Array.from({ length: 20 }, (_, i) => ({
          id: `tag-${i + 1}`,
          label: `标签 ${i + 1}`
        }))
      },
    {
      id: 'startDate',
      label: '开始日期',
      type: 'date' as const
    },
    {
      id: 'endDate',
      label: '结束日期',
      type: 'date' as const
    },
    {
        id: 'tags3',
        label: '标签3',
        type: 'list',
        listOptions: Array.from({ length: 15 }, (_, i) => ({
          id: `tag-${i + 1}`,
          label: `标签 ${i + 1}`
        }))
      },
  ];

  // 处理应用筛选条件
  const handleApplyFilters = (values: Record<string, any>) => {
    console.log('应用的筛选条件:', values);
    // 这里可以根据筛选条件更新数据或进行其他操作
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">筛选器示例</Typography>
          <FilterDrawer 
            filters={filters} 
            onApply={handleApplyFilters} 
          />
        </Box>
        
        <Typography variant="body1">
          点击右上角的"筛选"按钮打开筛选抽屉。
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          筛选结果将显示在控制台中。
        </Typography>
      </Paper>
    </Box>
  );
};

export default FilterDemo;