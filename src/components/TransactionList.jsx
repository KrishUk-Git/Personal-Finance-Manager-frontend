// src/components/TransactionList.jsx
import React from 'react';
import api from '../services/api';
import moment from 'moment';
import { FaTrash } from 'react-icons/fa';

const TransactionList = ({ transactions, onTransactionDeleted }) => {
    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await api.delete(`/transactions/${id}`);
                onTransactionDeleted(id);
            } catch (err) {
                console.error("Error deleting transaction:", err);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((t) => (
                        <div key={t._id} className="flex justify-between items-center p-3 rounded-lg border">
                            <div>
                                <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.category}
                                </p>
                                <p className="text-sm text-gray-500">{t.description}</p>
                                <p className="text-xs text-gray-400">{moment(t.date).format('MMMM Do YYYY')}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                 <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                   {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                 </p>
                                 <button onClick={() => handleDelete(t._id)} className="text-gray-500 hover:text-red-600">
                                    <FaTrash />
                                 </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No transactions yet.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionList;