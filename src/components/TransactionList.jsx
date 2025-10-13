import React from 'react';
import moment from 'moment';
import api from '../services/api';

const TransactionList = ({ transactions, onTransactionDeleted }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/transactions/${id}`);
      onTransactionDeleted(id);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">History</h3>
      <ul className="space-y-3">
        {transactions.map(t => (
          <li key={t._id} className={`flex justify-between items-center p-3 rounded border-r-4 ${t.type === 'income' ? 'border-green-500' : 'border-red-500'}`}>
            <div>
              <p className="font-semibold">{t.description}</p>
              <p className="text-sm text-gray-500">{t.category} on {moment(t.date).format('MMM D, YYYY')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
              <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-600 text-2xl leading-none">&times;</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
