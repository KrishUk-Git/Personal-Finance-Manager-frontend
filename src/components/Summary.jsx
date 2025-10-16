import React from 'react';

const Summary = ({ transactions }) => {
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="p-6 text-center bg-white rounded-lg shadow-md">
        <h4 className="mb-2 text-lg font-semibold text-gray-600">Total Income</h4>
        <p className="text-3xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
      </div>
      <div className="p-6 text-center bg-white rounded-lg shadow-md">
        <h4 className="mb-2 text-lg font-semibold text-gray-600">Total Expense</h4>
        <p className="text-3xl font-bold text-red-500">${totalExpense.toFixed(2)}</p>
      </div>
      <div className="p-6 text-center bg-white rounded-lg shadow-md">
        <h4 className="mb-2 text-lg font-semibold text-gray-600">Balance</h4>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>${balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Summary;

