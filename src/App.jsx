import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- 1. API SETUP ---
const api = axios.create({
  baseURL: 'https://personal-finance-manager-backend-4uij.onrender.com/api', // Your live backend URL
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// --- 2. AUTHENTICATION CONTEXT ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const userRes = await api.get('/auth');
    setUser(userRes.data);
    navigate('/dashboard');
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    const userRes = await api.get('/auth');
    setUser(userRes.data);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// --- 3. REUSABLE COMPONENTS ---

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">FinanceManager</Link>
        {user && (
          <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: moment().format('YYYY-MM-DD'),
  });

  const { description, amount, type, category, date } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/transactions', formData);
      onTransactionAdded(res.data);
      setFormData({ description: '', amount: '', type: 'expense', category: '', date: moment().format('YYYY-MM-DD') });
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const categories = type === 'expense'
    ? ['Groceries', 'Utilities', 'Entertainment', 'Transport', 'Other']
    : ['Salary', 'Bonus', 'Freelance', 'Other'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <label><input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={onChange} /> Expense</label>
          <label><input type="radio" name="type" value="income" checked={type === 'income'} onChange={onChange} /> Income</label>
        </div>
        <input type="text" name="description" value={description} onChange={onChange} placeholder="Description" required className="w-full p-2 border rounded" />
        <input type="number" name="amount" value={amount} onChange={onChange} placeholder="Amount" required className="w-full p-2 border rounded" />
        <select name="category" value={category} onChange={onChange} required className="w-full p-2 border rounded">
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input type="date" name="date" value={date} onChange={onChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Add Transaction</button>
      </form>
    </div>
  );
};

const TransactionList = ({ transactions, onTransactionDeleted }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/transactions/${id}`);
      onTransactionDeleted(id);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">History</h3>
      <ul className="space-y-3">
        {transactions.map(t => (
          <li key={t._id} className={`flex justify-between items-center p-3 rounded border-r-4 ${t.type === 'income' ? 'border-green-500' : 'border-red-500'}`}>
            <div>
              <p className="font-semibold">{t.description}</p>
              <p className="text-sm text-gray-500">{t.category} on {moment(t.date).format('MMM D, YYYY')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
              </span>
              <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-600 text-2xl leading-none">&times;</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Summary = ({ transactions }) => {
  const { income, expense, balance } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h4 className="text-gray-500">INCOME</h4>
        <p className="text-2xl font-bold text-green-600">${income.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h4 className="text-gray-500">EXPENSE</h4>
        <p className="text-2xl font-bold text-red-600">${expense.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h4 className="text-gray-500">BALANCE</h4>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>${balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

const ExpenseChart = ({ transactions }) => {
  const data = useMemo(() => {
    const expenseData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    return {
      labels: Object.keys(expenseData),
      datasets: [{
        data: Object.values(expenseData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    };
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
      {data.labels.length > 0 ? <Doughnut data={data} /> : <p className="text-center text-gray-500">No expense data.</p>}
    </div>
  );
};

// --- 4. PAGE COMPONENTS ---

const Dashboard = () => {
  const { user } = useContext(AuthContext);
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

const AuthForm = ({ isLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-6">
          {!isLogin && (
            <input type="text" name="username" onChange={onChange} placeholder="Username" required className="w-full p-2 border rounded" />
          )}
          <input type="email" name="email" onChange={onChange} placeholder="Email" required className="w-full p-2 border rounded" />
          <input type="password" name="password" onChange={onChange} placeholder="Password" required minLength="6" className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? '/register' : '/login'} className="text-blue-600 hover:underline">{isLogin ? 'Register' : 'Login'}</Link>
        </p>
      </div>
    </div>
  );
};

// --- 5. APP ROUTER ---

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><h1>Loading...</h1></div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<AuthForm isLogin />} />
            <Route path="/register" element={<AuthForm />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

// This wrapper component is necessary because AuthProvider uses the useNavigate hook.
const AppWithRouter = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

function App() {
  return (
    <Router>
        <AppWithRouter />
    </Router>
  );
}

export default App;

