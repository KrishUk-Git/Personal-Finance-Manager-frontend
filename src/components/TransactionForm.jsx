// src/components/TransactionForm.jsx
import React, { useState } from 'react';
import api from '../services/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
  });

  const { type, amount, category, date, description } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/transactions', formData);
      onTransactionAdded(res.data);
      // Reset form
      setFormData({
        type: 'expense', amount: '', category: '',
        date: new Date().toISOString().slice(0, 10), description: ''
      });
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Add New Transaction</h3>
      <form onSubmit={onSubmit}>
        {/* Form fields... */}
        <div className="mb-4">
            <label className="block text-gray-700">Type</label>
            <select name="type" value={type} onChange={onChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input type="number" name="amount" value={amount} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input type="text" name="category" value={category} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
         <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input type="date" name="date" value={date} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" required />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea name="description" value={description} onChange={onChange} className="w-full px-3 py-2 border rounded-lg"></textarea>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;