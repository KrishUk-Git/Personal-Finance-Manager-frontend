import React, { useState } from 'react';
import api from '../services/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const { description, amount, type, category, date } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/transactions', formData);
      onTransactionAdded(res.data);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select name="type" value={type} onChange={onChange} className="w-full p-2 border rounded">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input type="text" name="description" value={description} onChange={onChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input type="number" name="amount" value={amount} onChange={onChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input type="text" name="category" value={category} onChange={onChange} className="w-full p-2 border rounded" placeholder="e.g., Groceries" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" name="date" value={date} onChange={onChange} className="w-full p-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Add</button>
      </form>
    </div>
  );
};

export default TransactionForm;

