import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// 中心标签样式
const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

// 中心标签组件
function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  // 使用状态跟踪当前悬停的图例索引
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  
  // 原始数据
  const data = [
    { value: 5, label: 'A', color: '#3498db' },
    { value: 10, label: 'B', color: '#2ecc71' },
    { value: 15, label: 'C', color: '#e74c3c' },
    { value: 20, label: 'D', color: '#f39c12' },
  ];

  // 创建用于图表的数据，包括颜色
  const pieData = data.map((item, index) => ({
    ...item,
    // 自定义颜色逻辑：当某个图例被悬停时，其他片段变暗
    color: hoveredIndex === null || hoveredIndex === index 
      ? item.color 
      : `${item.color}80` // 添加80作为alpha值，使颜色半透明
  }));
  
  // 使用CSS变量定义图表尺寸
  const size = {
    width: 400,
    height: 200,
  };

  // 自定义图例组件
  const CustomLegend = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 3,
              cursor: 'pointer',
              fontWeight: hoveredIndex === index ? 'bold' : 'normal',
              transition: 'all 0.3s',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: item.color,
                mr: 1,
                borderRadius: '2px'
              }}
            />
            <span>{item.label}: {item.value}</span>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <PieChart 
        series={[
          { 
            data: pieData, 
            innerRadius: 80,
            // 禁用默认图例
            legend: { hidden: true }
          }
        ]} 
        {...size}
        slotProps={{
          legend: { hidden: true }
        }}
      >
        <PieCenterLabel>Center label</PieCenterLabel>
      </PieChart>
      
      {/* 添加自定义图例 */}
      <CustomLegend />
    </Box>
  );
}