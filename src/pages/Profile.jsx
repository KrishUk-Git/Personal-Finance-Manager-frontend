import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [currency, setCurrency] = useState('USD');
    const [notifications, setNotifications] = useState(true);
    const [mfaCode, setMfaCode] = useState('');
    const [mfaStep, setMfaStep] = useState('initial');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setCurrency(user.currency);
            setNotifications(user.notificationsEnabled);
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await api.put('/users/profile', { currency, notificationsEnabled: notifications });
            setUser(res.data);
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error("Failed to update profile", err);
            setMessage('Failed to update profile.');
        }
    };

    const handleSetupMFA = async () => {
        setMessage('');
        try {
            await api.post('/auth/mfa/setup');
            setMfaStep('verify');
            setMessage('MFA setup initiated. Check your email for a code to complete the process.');
        } catch (err) {
            setMessage('Failed to start MFA setup.');
        }
    };

    const handleVerifyMFA = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/auth/mfa/verify', { code: mfaCode });
            setMessage('MFA has been enabled successfully!');
            setMfaStep('initial');
            setMfaCode('');
            const userRes = await api.get('/auth');
            setUser(userRes.data);
        } catch (err) {
            setMessage('Invalid code. Please try again.');
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6">User Profile & Settings</h1>
                <div className="bg-white p-6 rounded-lg shadow-md max-w-full sm:max-w-lg mx-auto">
                    <div className="mb-4 space-y-2">
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
                        <div className="mb-4 flex items-center">
                            <input type="checkbox" id="notifications" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">Enable Browser Notifications</label>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Save Preferences</button>
                    </form>
                    
                    <div className="mt-8 pt-6 border-t">
                        <h2 className="text-2xl font-bold mb-4">Security</h2>
                        {user.mfaEnabled ? (
                            <p className="text-green-600 font-semibold">✓ Multi-Factor Authentication is enabled.</p>
                        ) : (
                            <div>
                                {mfaStep === 'initial' && (
                                    <button onClick={handleSetupMFA} className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">Enable Two-Factor Authentication</button>
                                )}
                                {mfaStep === 'verify' && (
                                    <form onSubmit={handleVerifyMFA} className="space-y-4">
                                        <p>Enter the 6-digit code sent to your email:</p>
                                        <input type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} className="w-full p-2 border rounded" maxLength="6" />
                                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Verify & Enable</button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {message && <p className="mt-4 text-center font-semibold text-gray-700">{message}</p>}
                </div>
            </main>
        </div>
    );
};

export default Profile;

