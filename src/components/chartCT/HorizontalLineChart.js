import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';
import { Chart as ChartJS, registerables } from 'chart.js';
import { handleData } from './handleChart';

ChartJS.register(...registerables);

const HorizontalLineChart = ({ statistics }) => {
  const [labels, setLabels] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (statistics) {
      const { labels, data } = handleData(statistics);
      setLabels(labels);
      setData(data);
    }
  }, [statistics]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            const value = context.parsed.x ? context.parsed.x.toFixed(2) : 0;
            return ` ${value}%`;
          },
        },
      },
      scales: {
        x: {
          grid: {
            borderWidth: 2, // Đặt độ rộng của lưới cho trục x
          },
        },
        y: {
          grid: {
            borderWidth: 2,
            display: false, // Đặt độ rộng của lưới cho trục y
          },
        },
      },
    },
  };

  const dataChart = {
    labels: labels || [],
    datasets: [
      {
        data: data || [],
        borderColor: 'rgb(32, 190, 255)',
        backgroundColor: 'rgba(32, 190, 255, 0.7)',
        // barPercentage: 0.2,
        // barThickness: 40,
        maxBarThickness: 50,
        minBarThickness: 20,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <Bar options={options} data={dataChart} />
    </div>
  );
};

export default HorizontalLineChart;
