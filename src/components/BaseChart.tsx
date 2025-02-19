import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';
import { useState } from 'react';

interface ChartDataItem {
  id: string | number;
  value: number;
  label: string;
}

interface BaseChartProps {
  type: 'pie' | 'bar';
  data: ChartDataItem[];
  width?: number;
  height?: number;
  title?: string;
  onItemClick?: (item: ChartDataItem) => void;
}

const BaseChart = ({ 
  type, 
  data, 
  width = 400, 
  height = 300, 
  title,
  onItemClick 
}: BaseChartProps) => {
  const [hiddenSeries, setHiddenSeries] = useState<(string | number)[]>([]);

  const handleLegendClick = (item: ChartDataItem) => {
    setHiddenSeries(prev => {
      if (prev.includes(item.id)) {
        return prev.filter(id => id !== item.id);
      }
      return [...prev, item.id];
    });
  };

  if (type === 'pie') {
    return (
      <Box>
        {title && <h3>{title}</h3>}
        <PieChart
          series={[
            {
              data: data
                .filter(item => !hiddenSeries.includes(item.id))
                .map(item => ({
                  id: item.id,
                  value: item.value,
                  label: item.label,
                })),
              highlightScope: { faded: 'global', highlighted: 'item' },
            },
          ]}
          width={width}
          height={height}
          onItemClick={(event, itemData) => {
            console.log()
            const clickedItem = data.find(item => item.id === itemData.id);
            if (clickedItem) onItemClick?.(clickedItem);
          }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
              itemGap: 20,
              hidden: false,
              onItemClick: (event, { id }) => {
                const clickedItem = data.find(item => item.id === id);
                if (clickedItem) handleLegendClick(clickedItem);
              },
            },
          }}
        />
      </Box>
    );
  }

  if (type === 'bar') {
    return (
      <Box>
        {title && <h3>{title}</h3>}
        <BarChart
          xAxis={[{ 
            scaleType: 'band', 
            data: data
              .filter(item => !hiddenSeries.includes(item.id))
              .map(item => item.label) 
          }]}
          series={[
            {
              data: data
                .filter(item => !hiddenSeries.includes(item.id))
                .map(item => item.value),
            },
          ]}
          width={width}
          height={height}
          onItemClick={(event, itemData) => {
            console.log(event)
            if (itemData.dataIndex !== undefined) {
              onItemClick?.(data[itemData.dataIndex]);
            }
          }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 0,
              itemGap: 20,
              hidden: false,
              onItemClick: (event, { id }) => {
                console.log(event)
                const clickedItem = data.find(item => item.id === id);
                if (clickedItem) handleLegendClick(clickedItem);
              },
            },
          }}
        />
      </Box>
    );
  }

  return null;
};

export default BaseChart;