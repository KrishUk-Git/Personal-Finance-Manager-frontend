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
  const [error, setError] = useState('');

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
    setError('');
    if (!category || !amount) return;
    try {
      const res = await api.post('/budgets', { category, amount: Number(amount), month });
      setBudgets([...budgets, res.data]);
      setCategory('');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add budget');
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
  }

  const getCategorySpending = (category) => {
    return transactions
      .filter(t => t.category === category && t.type === 'expense' && moment(t.date).format('YYYY-MM') === month)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Budgets</h1>
        
        <div className="mb-6">
          <label htmlFor="month-select" className="block text-lg font-medium mb-2 text-gray-700">Select Month</label>
          <input 
            type="month" 
            id="month-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Set a New Budget</h2>
          {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
          <form onSubmit={handleAddBudget} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Groceries" className="mt-1 w-full p-2 border rounded-md shadow-sm" required />
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 500" className="mt-1 w-full p-2 border rounded-md shadow-sm" required />
            </div>
            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add Budget</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Budgets for {moment(month).format("MMMM YYYY")}</h2>
          <div className="space-y-4">
            {budgets.length > 0 ? budgets.map(budget => {
              const spending = getCategorySpending(budget.category);
              const progress = (spending / budget.amount) * 100;
              const progressBarColor = progress > 100 ? 'bg-red-500' : 'bg-green-500';

              return (
                <div key={budget._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg text-gray-700">{budget.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">${spending.toFixed(2)} / ${budget.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteBudget(budget._id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className={progressBarColor + " h-4 rounded-full"} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                  </div>
                </div>
              );
            }) : <p className="text-gray-500">No budgets set for this month.</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Budgets;

