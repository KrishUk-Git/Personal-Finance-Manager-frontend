import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import moment from 'moment';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(moment().format('YYYY-MM'));

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, [month]);

  const fetchBudgets = async () => {
    try {
      const res = await api.get(`/budgets?month=${month}`);
      setBudgets(res.data);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    try {
      const res = await api.post('/budgets', { category, amount: Number(amount), month });
      setBudgets([...budgets.filter(b => b.category !== category), res.data]);
      setCategory('');
      setAmount('');
    } catch (err) {
      console.error("Failed to add budget", err);
    }
  };
  
  const handleDeleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(budgets.filter(b => b._id !== id));
    } catch(err) {
      console.error("Failed to delete budget", err);
    }
  };

  const getCategorySpending = (category) => transactions.filter(t => t.category === category && t.type === 'expense' && moment(t.date).format('YYYY-MM') === month).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Budgets</h1>
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Select Month</label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border rounded-md" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Set a New Budget</h2>
          <form onSubmit={handleAddBudget} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Groceries" className="w-full p-2 border rounded" required />
            </div>
            <div className="flex-1">
              <label className="block">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 500" className="w-full p-2 border rounded" required />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Set Budget</button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your Budgets for {moment(month).format("MMMM YYYY")}</h2>
          <div className="space-y-4">
            {budgets.length > 0 ? budgets.map(budget => {
              const spending = getCategorySpending(budget.category);
              const progress = (spending / budget.amount) * 100;
              const progressBarColor = progress > 100 ? 'bg-red-500' : 'bg-green-500';

              return (
                <div key={budget._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{budget.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">${spending.toFixed(2)} / ${budget.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteBudget(budget._id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4"><div className={`${progressBarColor} h-4 rounded-full`} style={{ width: `${Math.min(progress, 100)}%` }}></div></div>
                </div>
              );
            }) : <p>No budgets set for this month.</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Budgets;

