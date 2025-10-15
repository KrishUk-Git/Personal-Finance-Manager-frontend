import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import moment from 'moment';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const fetchBudgetsAndTransactions = async () => {
    try {
      const [budgetsRes, transactionsRes] = await Promise.all([
        api.get(`/budgets?month=${month}`),
        api.get('/transactions') // Fetch all transactions to calculate spending
      ]);
      setBudgets(budgetsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchBudgetsAndTransactions();
  }, [month]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    try {
      await api.post('/budgets', { category, amount, month });
      fetchBudgetsAndTransactions(); // Refetch to show the new budget
      setCategory('');
      setAmount('');
    } catch (error) {
      alert(error.response?.data?.msg || 'Failed to add budget');
    }
  };
  
  const handleDeleteBudget = async (id) => {
      if (window.confirm("Are you sure you want to delete this budget?")) {
          try {
              await api.delete(`/budgets/${id}`);
              fetchBudgetsAndTransactions(); // Refetch
          } catch (error) {
              console.error("Failed to delete budget", error);
          }
      }
  };

  const spendingByCategory = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && moment(t.date).format('YYYY-MM') === month)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  }, [transactions, month]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Budgets for {moment(month).format('MMMM YYYY')}</h2>
          <input 
            type="month" 
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="p-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Budget Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Set New Budget</h3>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category Name (e.g., Groceries)" required className="w-full p-2 border rounded" />
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Budget Amount" required className="w-full p-2 border rounded" />
              <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Set Budget</button>
            </form>
          </div>

          {/* Budgets List */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Your Budgets</h3>
            <div className="space-y-4">
              {budgets.length > 0 ? budgets.map(budget => {
                const spent = spendingByCategory[budget.category] || 0;
                const remaining = budget.amount - spent;
                const progress = (spent / budget.amount) * 100;
                return (
                  <div key={budget._id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">{budget.category}</span>
                        <button onClick={() => handleDeleteBudget(budget._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full ${progress > 100 ? 'bg-red-600' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm mt-1 flex justify-between">
                      <span>Spent: ${spent.toFixed(2)}</span>
                      <span>Budget: ${budget.amount.toFixed(2)}</span>
                      <span className={remaining < 0 ? 'text-red-600 font-bold' : ''}>
                        {remaining >= 0 ? `$${remaining.toFixed(2)} Remaining` : `$${Math.abs(remaining).toFixed(2)} Over`}
                      </span>
                    </div>
                  </div>
                )
              }) : <p className="text-center text-gray-500">No budgets set for this month.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Budgets;
