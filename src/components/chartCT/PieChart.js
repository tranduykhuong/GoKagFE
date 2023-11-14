/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { handleData } from './handleChart';

ChartJS.register(...registerables);

const PieChart = ({ statistics }) => {
  const [labels, setLabels] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (statistics) {
      const { labels, data } = handleData(statistics);
      setLabels(labels);
      setData(data);
    }
  }, [statistics]);

  const dataChart = {
    labels: labels || [],
    datasets: [
      {
        data: data || [],
        backgroundColor: [
          'rgba(246, 192, 52, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(122, 207, 73, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(246, 192, 52, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(122, 207, 73, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label(context) {
            const value = context.parsed ? context.parsed.toFixed(2) : 0;
            return ` ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <Pie width="100%" datasetIdKey="id" data={dataChart} options={options} />
    </div>
  );
};

export default React.memo(PieChart);
