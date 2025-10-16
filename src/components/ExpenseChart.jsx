import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ transactions }) => {
  const expenseData = transactions.filter((t) => t.type === 'expense').reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(expenseData),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(expenseData),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
    }],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
      {Object.keys(expenseData).length > 0 ? (
        <Doughnut data={data} />
      ) : (
        <p className="text-center text-gray-500">No expense data to display.</p>
      )}
    </div>
  );
};

export default ExpenseChart;

