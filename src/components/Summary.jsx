import React, { useMemo } from 'react';

const Summary = ({ transactions }) => {
  const { income, expense, balance } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h4 className="text-gray-500">INCOME</h4>
        <p className="text-2xl font-bold text-green-600">${income.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h4 className="text-gray-500">EXPENSE</h4>
        <p className="text-2xl font-bold text-red-600">${expense.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h4 className="text-gray-500">BALANCE</h4>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>${balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Summary;
