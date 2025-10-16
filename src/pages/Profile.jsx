import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setUser(res.data);
        setCurrency(res.data.currency);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', { currency });
      setUser(res.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setMessage('Failed to update profile.');
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <div className="mb-4">
            <p><span className="font-semibold">Username:</span> {user.username}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
          </div>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label htmlFor="currency" className="block font-medium">Default Currency</label>
              <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 block w-full p-2 border rounded-md">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Save Preferences</button>
            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;

