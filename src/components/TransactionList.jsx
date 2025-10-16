import React from 'react';
import moment from 'moment';

const TransactionList = ({ transactions, onTransactionDeleted }) => (
  <ul className="space-y-3">
    {transactions.map((transaction) => (
      <li key={transaction._id} className={`flex items-center justify-between p-3 border-r-4 rounded bg-white shadow-sm ${transaction.type === 'income' ? 'border-green-500' : 'border-red-500'}`}>
        <div>
          <p className="font-semibold">{transaction.description} <span className="text-sm text-gray-500">({transaction.category})</span></p>
          <p className="text-xs text-gray-400">{moment(transaction.date).format('MMMM Do, YYYY')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
            {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
          </span>
          <button onClick={() => onTransactionDeleted(transaction._id)} className="bg-gray-200 text-gray-600 px-2 py-1 text-xs rounded hover:bg-gray-300">X</button>
        </div>
      </li>
    ))}
  </ul>
);

export default TransactionList;

