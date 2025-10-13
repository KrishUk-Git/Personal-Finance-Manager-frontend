import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await register(formData.username, formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-6">
          <input type="text" name="username" onChange={onChange} placeholder="Username" required className="w-full p-2 border rounded" />
          <input type="email" name="email" onChange={onChange} placeholder="Email" required className="w-full p-2 border rounded" />
          <input type="password" name="password" onChange={onChange} placeholder="Password" required minLength="6" className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold">
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
