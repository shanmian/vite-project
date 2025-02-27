import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';
import { Box, styled, Typography, Stack } from '@mui/material';
import { useDrawingArea } from '@mui/x-charts';
import { useState } from 'react';

interface PieChartData {
  id: string | number;
  value: number;
  label: string;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  title?: string;
  centerLabel?: string;
  handseriseClick?: (event: any, d: any) => void;
  handleLengedClick?: (event: any, d: any) => void;
}

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

const LegendItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: 4,
  transition: 'all 0.3s',
  backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
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

const PieChart = ({
  data,
  width = 400,
  height = 300,
  title,
  centerLabel,
  handseriseClick,
  handleLengedClick
}: PieChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isAllZero = data.every(item => item.value === 0);
  const emptyChartData = [
    { id: 1, value: 1, label: '0%-A', color: '#E0E0E0' },
    { id: 2, value: 0, label: '0%-B', color: '#4caf50' },
    { id: 3, value: 0, label: '0%-C', color: '#ff9800' },
    { id: 4, value: 0, label: '0%-D', color: '#f44336' }
  ];

  // 处理数据，添加高亮效果
  const chartData = (isAllZero ? emptyChartData : data).map((item, index) => ({
    ...item,
    color: hoveredIndex === null || hoveredIndex === index 
      ? item.color 
      : `${item.color}80` // 添加透明度
  }));

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom align="center">
          {title}
        </Typography>
      )}
      <MuiPieChart
        margin={{ bottom: 70 }}
        series={[{
          data: chartData,
          innerRadius: 80,
          outerRadius: 100,
          paddingAngle: 2,
          cornerRadius: 4,
          highlighted: {
            innerRadius: 75,
            outerRadius: 110,
            additionalRadius: 10,
          }
        }]}
        slotProps={{
          legend: {
            hidden: true
          }
        }}
        tooltip={{
          trigger: isAllZero ? 'none' : 'item'
        }}
        width={width}
        height={height}
        onItemClick={isAllZero ? undefined : handseriseClick}
      >
        <PieCenterLabel>{centerLabel}</PieCenterLabel>
      </MuiPieChart>
      
      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center" 
        sx={{ mt: 2 }}
      >
        {chartData.map((item, index) => (
          <LegendItem
            key={item.id}
            isActive={hoveredIndex === index}
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

export default PieChart;