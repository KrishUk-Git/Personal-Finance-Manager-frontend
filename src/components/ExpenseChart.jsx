import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ transactions }) => {
  const data = useMemo(() => {
    const expenseData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    return {
      labels: Object.keys(expenseData),
      datasets: [{
        data: Object.values(expenseData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    };
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
      {data.labels.length > 0 ? <Doughnut data={data} /> : <p className="text-center text-gray-500">No expense data.</p>}
    </div>
  );
};

export default ExpenseChart;
