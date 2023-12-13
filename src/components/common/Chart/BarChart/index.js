import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from "@faker-js/faker";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Thống kê hoạt động của học sinh',
        },
    },
};

const labels = ['Nguyen Van A', 'Nguyen Thi B', 'Tran Van C', 'Dang Thi B', 'Cao Van C', 'Tran Van B'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Điểm tích lũy',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
    ],
};

export function AppBarChart() {
    return <Bar options={options} data={data} />;
}
