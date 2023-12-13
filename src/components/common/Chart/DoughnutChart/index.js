import React from 'react';
import './doughnut-chart.scss'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    labels: ['Tỷ lệ hoạt động', 'Tỷ lệ không hoạt động'],
    datasets: [
        {
            label: 'Điểm tích lũy',
            data: [75, 25],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',

            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',

            ],
            borderWidth: 1,
        },
    ],

};

export default function AppDoughnutChart() {
    return (

        <Pie data={data} />
    )
}
