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
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Risk Score Distribution',
        },
    },
};

const labels = ['NIST', 'SOC2', 'SOX', 'OWASP', 'MAESTRO'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Average Risk Score',
            data: [65, 59, 80, 81, 56],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <Bar options={options} data={data} />
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded">
                            <p className="text-sm text-gray-500">Total Requests</p>
                            <p className="text-2xl font-bold">24</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded">
                            <p className="text-sm text-gray-500">Approved</p>
                            <p className="text-2xl font-bold">18</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold">4</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded">
                            <p className="text-sm text-gray-500">High Risk</p>
                            <p className="text-2xl font-bold">2</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
