import BaseChart from '../../components/BaseChart';

// Example usage
const Chart = () => {
    const pieData = [
      { id: 1, value: 30, label: 'A' },
      { id: 2, value: 20, label: 'B' },
      { id: 3, value: 50, label: 'C' },
    ];
  
    const barData = [
      { id: 1, value: 10, label: '2020' },
      { id: 2, value: 20, label: '2021' },
      { id: 3, value: 30, label: '2022' },
    ];
  
    return (
      <div>
        <BaseChart 
          type="pie"
          data={pieData}
          title="Pie Chart Example"
        />
        
        <BaseChart 
          type="bar"
          data={barData}
          title="Bar Chart Example"
        />
      </div>
    );
  };

export default Chart;