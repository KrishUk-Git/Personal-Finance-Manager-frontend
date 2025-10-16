import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ExpenseChart from '../components/ExpenseChart';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [reportData, setReportData] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
      calculateReport(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  const calculateReport = (data) => {
    const totalIncome = data.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = data.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    setReportData({ totalIncome, totalExpense, balance: totalIncome - totalExpense });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Total Income</h2>
                <p className="text-3xl text-green-500">${reportData.totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Total Expense</h2>
                <p className="text-3xl text-red-500">${reportData.totalExpense.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2">Net Balance</h2>
                <p className="text-3xl">${reportData.balance.toFixed(2)}</p>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExpenseChart transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default Reports;

