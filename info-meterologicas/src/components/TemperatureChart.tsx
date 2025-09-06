// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';

// import type { ChartDataPoint } from './WeatherApp';

// // Registra os componentes necessários do Chart.js
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

// // Define a interface para os dados do gráfico
// interface TemperatureChartProps {
//     // Usamos a interface importada de WeatherApp.tsx
//     hourlyData: ChartDataPoint[]; 
// }

// const TemperatureChart: React.FC<TemperatureChartProps> = ({ hourlyData }) => {
//     // Formata os dados para o formato que o Chart.js espera
//     const data = {
//         labels: hourlyData.map(hour => {
//             const date = new Date(hour.dt * 1000);
//             return `${date.getHours()}h`;
//         }),
//         datasets: [
//             {
//                 label: 'Temperatura (°C)',
//                 data: hourlyData.map(hour => hour.temp),
//                 borderColor: 'rgba(0, 123, 255, 1)',
//                 backgroundColor: 'rgba(0, 123, 255, 0.2)',
//                 fill: true,
//                 tension: 0.4,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false,
//             },
//             title: {
//                 display: false,
//             },
//             tooltip: {
//                 backgroundColor: 'rgba(255, 255, 255, 0.4)',
//                 titleColor: '#000',
//                 bodyColor: '#000',
//                 borderColor: 'rgba(0, 0, 0, 0.2)',
//                 borderWidth: 1,
//             },
//         },
//         scales: {
//             x: {
//                 grid: {
//                     display: false,
//                 },
//                 ticks: {
//                     color: '#000',
//                 },
//             },
//             y: {
//                 grid: {
//                     color: 'rgba(0, 0, 0, 0.1)',
//                 },
//                 ticks: {
//                     color: '#000',
//                 },
//             },
//         },
//     };

//     return <Line data={data} options={options} />;
// };

// export default TemperatureChart;