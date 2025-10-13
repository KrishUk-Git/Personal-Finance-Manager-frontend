import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpenseChart from '../components/ExpenseChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.username}!</h2>
        <Summary transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <TransactionForm onTransactionAdded={(t) => setTransactions([t, ...transactions])} />
          </div>
          <div className="lg:col-span-3">
            <TransactionList transactions={transactions} onTransactionDeleted={(id) => setTransactions(transactions.filter(t => t._id !== id))} />
          </div>
        </div>
        <div className="mt-8 max-w-md mx-auto">
          <ExpenseChart transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
