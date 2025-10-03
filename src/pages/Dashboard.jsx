// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Navbar from '../components/Navbar';


const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const removeTransaction = (id) => {
    setTransactions(transactions.filter(t => t._id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user && user.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <TransactionForm onTransactionAdded={addTransaction} />
                </div>
                <div className="md:col-span-2">
                    <TransactionList transactions={transactions} onTransactionDeleted={removeTransaction} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;