import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ExpenseChart from '../components/ExpenseChart';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgetReport, setBudgetReport] = useState([]);
  const [incomeReport, setIncomeReport] = useState([]);
  const [month, setMonth] = useState(moment().format('YYYY-MM'));

  useEffect(() => {
    fetchTransactions();
    fetchBudgetReport();
    fetchIncomeReport();
  }, [month]);

  const fetchTransactions = async () => {
    const res = await api.get('/transactions');
    setTransactions(res.data);
  };
  
  const fetchBudgetReport = async () => {
    const res = await api.get(`/reports/budget-variance?month=${month}`);
    setBudgetReport(res.data);
  };

  const fetchIncomeReport = async () => {
    try {
        const res = await api.get('/reports/income-summary');
        setIncomeReport(res.data);
    } catch (err) {
        console.error("Failed to fetch income report", err);
    }
  };

  const incomeChartData = {
    labels: incomeReport.map(item => item._id),
    datasets: [{
      label: 'Income by Source',
      data: incomeReport.map(item => item.totalAmount),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExpenseChart transactions={transactions} />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Budget vs. Actual Spending</h2>
                <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="p-2 border rounded-md mb-4" />
                <div className="space-y-4">
                    {budgetReport.length > 0 ? budgetReport.map(item => (
                        <div key={item._id}>
                            <div className="flex justify-between font-semibold">
                                <span>{item.category}</span>
                                <span>${item.actualSpending.toFixed(2)} / ${item.amount.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                                <div className={`h-4 rounded-full ${item.variance >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min((item.actualSpending / item.amount) * 100, 100)}%`}}></div>
                            </div>
                        </div>
                    )) : <p>No budget data for this month.</p>}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Income Sources</h2>
                {incomeReport.length > 0 ? <Bar data={incomeChartData} /> : <p>No income data to display.</p>}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;

