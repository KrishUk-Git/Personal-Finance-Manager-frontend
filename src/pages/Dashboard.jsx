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
  const [filters, setFilters] = useState({ type: 'all', category: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let tempTransactions = [...transactions];
    if (filters.type !== 'all') tempTransactions = tempTransactions.filter((t) => t.type === filters.type);
    if (filters.category) tempTransactions = tempTransactions.filter((t) => t.category.toLowerCase().includes(filters.category.toLowerCase()));
    setFilteredTransactions(tempTransactions);
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransactionDeleted = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export CSV data', err);
      alert('Failed to export data.');
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await api.get('/reports/export/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export PDF data', err);
      alert('Failed to export PDF data.');
    }
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <div className="flex space-x-2">
                    <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">Export CSV</button>
                    <button onClick={handleExportPDF} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">Export PDF</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select name="type" onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="p-2 border rounded">
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input type="text" name="category" placeholder="Filter by category..." onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="p-2 border rounded" />
              </div>
              <TransactionList transactions={filteredTransactions} onTransactionDeleted={handleTransactionDeleted} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

