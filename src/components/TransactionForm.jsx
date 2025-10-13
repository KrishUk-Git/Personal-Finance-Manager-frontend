import React, { useState } from 'react';
import moment from 'moment';
import api from '../services/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: moment().format('YYYY-MM-DD'),
  });

  const { description, amount, type, category, date } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      alert('Please select a category.');
      return;
    }
    try {
      const res = await api.post('/transactions', formData);
      onTransactionAdded(res.data);
      setFormData({ description: '', amount: '', type: 'expense', category: '', date: moment().format('YYYY-MM-DD') });
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const categories = type === 'expense'
    ? ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Other']
    : ['Salary', 'Bonus', 'Freelance', 'Other'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <label><input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={onChange} /> Expense</label>
          <label><input type="radio" name="type" value="income" checked={type === 'income'} onChange={onChange} /> Income</label>
        </div>
        <input type="text" name="description" value={description} onChange={onChange} placeholder="Description" required className="w-full p-2 border rounded" />
        <input type="number" name="amount" value={amount} onChange={onChange} placeholder="Amount" required className="w-full p-2 border rounded" />
        <select name="category" value={category} onChange={onChange} required className="w-full p-2 border rounded">
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="date" name="date" value={date} onChange={onChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Add Transaction</button>
      </form>
    </div>
  );
};

export default TransactionForm;
