import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RMChart = ({ registros }) => {
  const sorted = [...registros].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const data = {
    labels: sorted.map(r => new Date(r.fecha).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })),
    datasets: [
      {
        label: '1RM Estimado',
        data: sorted.map(r => r.rmEstimado),
        borderColor: '#1a73e8',
        backgroundColor: (context) => {
          const bg = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          bg.addColorStop(0, 'rgba(26, 115, 232, 0.25)');
          bg.addColorStop(1, 'rgba(26, 115, 232, 0)');
          return bg;
        },
        borderWidth: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#1a73e8',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#1a73e8',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 4,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#202124',
        padding: 16,
        titleFont: { size: 12, weight: 'normal', family: 'Inter' },
        bodyFont: { size: 16, weight: 'bold', family: 'Inter' },
        bodySpacing: 8,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          title: (items) => `Fecha: ${items[0].label}`,
          label: (context) => `${context.parsed.y.toFixed(1)} kg`
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#f1f3f4', drawBorder: false },
        ticks: { 
          color: '#5f6368', 
          font: { size: 12, family: 'Inter' },
          padding: 10,
          callback: (value) => `${value}kg`
        },
        beginAtZero: false
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: '#5f6368', 
          font: { size: 11, family: 'Inter' },
          padding: 10
        }
      }
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default RMChart;
