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
    visualTheme: string;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, visualTheme }) => {
    // Determine colors based on visual theme
    const isDarkText = visualTheme === 'manha' || visualTheme === 'tarde';
    const mainColor = isDarkText ? '#000000' : '#ffffff';
    const gridColor = isDarkText ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const tooltipBg = isDarkText ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
    const tooltipText = isDarkText ? '#000' : '#fff';

    const chartData = {
        labels: data.map(item => item.time),
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: data.map(item => item.temp),
                borderColor: mainColor,
                backgroundColor: isDarkText ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                pointBackgroundColor: mainColor,
                pointBorderColor: mainColor,
                tension: 0.4,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Previsão de Temperatura',
                color: mainColor,
                font: {
                    size: 16
                }
            },
            tooltip: {
                backgroundColor: tooltipBg,
                titleColor: tooltipText,
                bodyColor: tooltipText,
                borderColor: gridColor,
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: { color: mainColor },
                grid: { display: false }
            },
            y: {
                ticks: { color: mainColor },
                grid: { 
                    color: gridColor 
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
