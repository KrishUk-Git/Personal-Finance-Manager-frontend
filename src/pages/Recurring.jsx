import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import moment from 'moment';

const Recurring = () => {
    const [recurring, setRecurring] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        startDate: new Date().toISOString().slice(0, 10),
    });

    useEffect(() => {
        fetchRecurring();
    }, []);

    const fetchRecurring = async () => {
        try {
            const res = await api.get('/recurring');
            setRecurring(res.data);
        } catch (err) { console.error("Failed to fetch recurring transactions", err); }
    };

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/recurring', formData);
            setRecurring([...recurring, res.data]);
            setFormData({
                description: '', amount: '', type: 'expense', category: '',
                startDate: new Date().toISOString().slice(0, 10),
            });
        } catch (err) { console.error("Failed to add recurring transaction", err); }
    };
    
    const onDelete = async (id) => {
        try {
            await api.delete(`/recurring/${id}`);
            setRecurring(recurring.filter(r => r._id !== id));
        } catch (err) { console.error("Failed to delete recurring transaction", err); }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Recurring Transactions</h1>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Add Recurring Transaction</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input type="text" name="description" value={formData.description} onChange={onChange} placeholder="Description" required className="w-full p-2 border rounded"/>
                        <input type="number" name="amount" value={formData.amount} onChange={onChange} placeholder="Amount" required className="w-full p-2 border rounded"/>
                        <select name="type" value={formData.type} onChange={onChange} className="w-full p-2 border rounded">
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        <input type="text" name="category" value={formData.category} onChange={onChange} placeholder="Category" required className="w-full p-2 border rounded"/>
                        <div>
                            <label>Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={onChange} required className="w-full p-2 border rounded"/>
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Add Recurring</button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Your Recurring Items</h2>
                    <ul className="space-y-3">
                        {recurring.map(item => (
                            <li key={item._id} className="flex justify-between items-center p-3 border rounded">
                                <span>{item.description} (${item.amount} / month)</span>
                                <button onClick={() => onDelete(item._id)} className="text-red-500">Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Recurring;

