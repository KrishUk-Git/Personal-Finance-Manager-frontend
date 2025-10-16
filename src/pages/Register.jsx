import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block">Username</label>
            <input type="text" name="username" value={formData.username} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded" />
          </div>
          <div>
            <label className="block">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} required className="w-full px-3 py-2 mt-1 border rounded" />
          </div>
          <div>
            <label className="block">Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChange} required minLength="6" className="w-full px-3 py-2 mt-1 border rounded" />
          </div>
          <button type="submit" className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Register</button>
        </form>
        <p className="text-center">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;

