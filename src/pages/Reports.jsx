import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // This is important for Chart.js v3+

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [reportData, setReportData] = useState(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      generateReport();
    }
  }, [transactions]);

  const generateReport = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
      
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      
    setReportData({
      income,
      expense,
      expenseByCategory,
    });
  };

  const chartData = {
    labels: reportData ? Object.keys(reportData.expenseByCategory) : [],
    datasets: [
      {
        label: 'Expenses by Category',
        data: reportData ? Object.values(reportData.expenseByCategory) : [],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Financial Reports</h1>
        
        {reportData ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-gray-600">Total Income</h2>
                <p className="text-3xl font-bold text-green-500 mt-2">${reportData.income.toFixed(2)}</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-gray-600">Total Expenses</h2>
                <p className="text-3xl font-bold text-red-500 mt-2">${reportData.expense.toFixed(2)}</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-gray-600">Net Savings</h2>
                <p className="text-3xl font-bold text-blue-500 mt-2">${(reportData.income - reportData.expense).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Expense Breakdown</h2>
              <Bar data={chartData} />
            </div>
          </div>
        ) : (
          <p>No transaction data available to generate reports.</p>
        )}
      </main>
    </div>
  );
};

export default Reports;
