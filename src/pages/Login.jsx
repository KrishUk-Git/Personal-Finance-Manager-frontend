import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded" />
          </div>
          <div>
            <label className="block">Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded" />
          </div>
          <button type="submit" className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Login</button>
        </form>
        <p className="text-center">Don't have an account? <Link to="/register" className="text-indigo-600">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;

