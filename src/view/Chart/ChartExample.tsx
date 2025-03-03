import { Box } from '@mui/material';
import { PieChart, BarChart } from '../../components/ChartComponent';
import {addChartData} from '../../../static/allchart'
const ChartExample = () => {
    // 饼图数据
    const pieData = [
        { id: 1, value: 35, label: '分类A', color: '#2196f3' },
        { id: 2, value: 25, label: '分类B', color: '#4caf50' },
        { id: 3, value: 40, label: '分类C', color: '#ff9800' }
    ];
    const PieChartTitle = `PieChart ${pieData[0].label}`;
    // 柱状图数据
    const barData = [
        { data: [60], stack: 'A', label: 'No Data', color: '#2196f3' },
         { data: [40], stack: 'A', label: '60%-pending', color: '#4caf50' }
    ];

    const labels = ['pending'];
    const filterChartData = (data: any, filterKeys: string[]) => {
        const filteredData = {
          data: data.data.map((item: any) => ({
            LEVEL_1_KEY: Object.fromEntries(
              Object.entries(item.LEVEL_1_KEY).filter(([key]) => filterKeys.includes(key))
            )
          }))
        };
        return filteredData;
      };
      const b = ['PFL', 'NAV', 'SOD'];
      console.log(filterChartData(addChartData,b))
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <PieChart
                    data={pieData}
                    title={PieChartTitle}
                    width={500}
                    height={300}
                    handseriseClick={(event, item) => {
                        console.log('点击饼图:', item);
                    }}
                    handleLengedClick={(event, item) => {
                        console.log('点击图例:', item);
                    }}
                />
            </Box>

            <Box>
                <BarChart
                    series={barData}
                    labels={labels}
                    title="BarChart"
                    onItemClick={(event, item) => {
                        console.log('点击柱形:', item);
                    }}
                    handleLengedClick={(event, item) => {
                        console.log('点击 bar图例:', item);
                    }}
                />
            </Box>
        </Box>
    );
};

export default ChartExample;