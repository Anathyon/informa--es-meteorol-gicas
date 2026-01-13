import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { HourlyForecastData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TemperatureChartProps {
    data: HourlyForecastData[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
    
    const chartData = {
        labels: data.map(item => item.time),
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: data.map(item => item.temp),
                borderColor: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                pointBackgroundColor: '#fff',
                pointBorderColor: '#fff',
                tension: 0.4, // Curvas suaves
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Esconder legenda para visual mais limpo
            },
            title: {
                display: true,
                text: 'Previsão de Temperatura',
                color: '#fff',
                font: {
                    size: 16
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
            }
        },
        scales: {
            x: {
                ticks: { color: '#fff' },
                grid: { display: false }
            },
            y: {
                ticks: { color: '#fff' },
                grid: { 
                    color: 'rgba(255, 255, 255, 0.1)' 
                }
            }
        }
    };

    return (
        <div className="chart-container" style={{ width: '100%', height: '100%' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default TemperatureChart;
