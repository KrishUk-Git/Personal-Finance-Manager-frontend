import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Summary from '../components/Summary';
import ExpenseChart from '../components/ExpenseChart';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: '',
    dateRange: 'all',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = () => {
    let tempTransactions = [...transactions];

    if (filters.type !== 'all') {
      tempTransactions = tempTransactions.filter(t => t.type === filters.type);
    }
    if (filters.category) {
      tempTransactions = tempTransactions.filter(t => t.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    setFilteredTransactions(tempTransactions);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.username}!</h1>
        <Summary transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 space-y-8">
            <TransactionForm onTransactionAdded={(t) => setTransactions([t, ...transactions])} />
            <ExpenseChart transactions={transactions} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Transactions</h2>
              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select name="type" onChange={handleFilterChange} className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input type="text" name="category" placeholder="Filter by category..." onChange={handleFilterChange} className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <TransactionList
                transactions={filteredTransactions}
                onTransactionDeleted={(id) => setTransactions(transactions.filter(t => t._id !== id))}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

