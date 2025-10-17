import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mfaCode, setMfaCode] = useState('');
  const [userId, setUserId] = useState(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();
  
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.mfaRequired) {
        setMfaRequired(true);
        setUserId(res.data.userId);
        setError('MFA is enabled. Please check your email for a verification code.');
      } else {
        localStorage.setItem('token', res.data.token);
        const userRes = await api.get('/auth');
        setUser(userRes.data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  const onVerifyMFA = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const res = await api.post('/auth/mfa/verify-login', { userId, code: mfaCode });
        localStorage.setItem('token', res.data.token);
        const userRes = await api.get('/auth');
        setUser(userRes.data);
        navigate('/dashboard');
    } catch (err) {
        setError(err.response?.data?.msg || 'MFA validation failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {!mfaRequired ? (
          <>
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
              <button type="submit" className="w-full py-2 text-white bg-indigo-600 rounded">Login</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center">Enter Verification Code</h2>
            {error && <p className="text-yellow-600 bg-yellow-100 p-3 rounded text-center">{error}</p>}
            <form onSubmit={onVerifyMFA} className="space-y-6">
              <div>
                <label className="block">6-Digit Code</label>
                <input type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded" maxLength="6" />
              </div>
              <button type="submit" className="w-full py-2 text-white bg-green-600 rounded">Verify</button>
            </form>
          </>
        )}
        <p className="text-center">Don't have an account? <Link to="/register" className="text-indigo-600">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;

