import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Stack, styled } from '@mui/material';
import { useState } from 'react';

interface SeriesData {
  data: number[];
  stack?: string;
  label?: string;
  color?: string;
}

interface BarChartProps {
  series: SeriesData[];
  width?: number;
  height?: number;
  title?: string;
  labels?: string[];
  onItemClick?: (event: any, itemData: any) => void;
  handleLengedClick?: (event: any, itemData: any) => void;
}

// 自定义图例项样式
const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: 4,
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[2]
  }
}));

const LegendColor = styled(Box)({
  width: 20,
  height: 20,
  marginRight: 8,
  borderRadius: 4,
});

const BarChart = ({
  series,
  width = 400,
  height = 300,
  title,
  labels,
  onItemClick,
  handleLengedClick
}: BarChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 处理数据，添加高亮效果
  const chartSeries = series.map((item, index) => ({
    ...item,
    color: hoveredIndex === null || hoveredIndex === index 
      ? item.color 
      : `${item.color}80`, // 添加透明度
    valueFormatter: (value: number) => `${value}`,
    highlightScope: {
      highlighted: 'item',
      faded: 'global'
    }
  }));

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      <MuiBarChart
        margin={{ bottom: 70 }}
        xAxis={[{
          data: labels,
          scaleType: 'band'
        }]}
        yAxis={[{
          min: 0,
          max: 100,
          tickInterval: [0, 20, 40, 60, 80, 100],
          valueFormatter: (value: number) => `${value}%`
        }]}
        series={chartSeries}
        slotProps={{
          legend: {
            hidden: true // 隐藏默认图例
          }
        }}
        width={width}
        height={height}
        onItemClick={onItemClick}
      />

      {/* 自定义图例 */}
      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center" 
        sx={{ mt: 2 }}
      >
        {series.map((item, index) => (
          <LegendItem
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={(event) => handleLengedClick?.(event, item)}
          >
            <LegendColor sx={{ 
              backgroundColor: item.color,
              opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5
            }} />
            <Typography 
              variant="body2"
              sx={{
                fontWeight: hoveredIndex === index ? 'bold' : 'normal'
              }}
            >
              {item.label}
            </Typography>
          </LegendItem>
        ))}
      </Stack>
    </Box>
  );
};

export default BarChart;