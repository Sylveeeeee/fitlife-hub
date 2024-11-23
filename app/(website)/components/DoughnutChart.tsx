"use client";
import React,{useEffect , useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: number[]; 
  labels: string[]; 
  colors?: string[]; 
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, labels, colors }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors || ['#FF6384', '#36A2EB', '#FFCE56'], 
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          },
        });
      }
    }
  }, [data, labels, colors]);

  return <canvas ref={chartRef}></canvas>;
};

export default DoughnutChart;
