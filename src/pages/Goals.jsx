import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import moment from 'moment';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({ name: '', targetAmount: '', targetDate: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
    } catch (err) {
      console.error("Failed to fetch goals", err);
    }
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/goals', formData);
      setGoals([...goals, res.data]);
      setFormData({ name: '', targetAmount: '', targetDate: '' });
    } catch (err) {
      console.error("Failed to add goal", err);
    }
  };
  
  const onDeleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch(err) {
      console.error("Failed to delete goal", err);
    }
  };

  const onUpdateGoal = async (id, amount) => {
    const currentAmount = prompt("Enter new current amount:", amount);
    if(currentAmount !== null && !isNaN(currentAmount)) {
      try {
        const res = await api.put(`/goals/${id}`, { currentAmount: Number(currentAmount) });
        setGoals(goals.map(g => g._id === id ? res.data : g));
      } catch(err) {
        console.error("Failed to update goal", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Financial Goals</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Set a New Goal</h2>
          <form onSubmit={onAddGoal} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Goal Name (e.g., Vacation)" className="p-2 border rounded" required />
            <input type="number" name="targetAmount" value={formData.targetAmount} onChange={onChange} placeholder="Target Amount" className="p-2 border rounded" required />
            <div>
              <label className="text-sm">Target Date (Optional)</label>
              <input type="date" name="targetDate" value={formData.targetDate} onChange={onChange} className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="md:col-span-3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Goal</button>
          </form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{goal.name}</h3>
                  <button onClick={() => onDeleteGoal(goal._id)} className="text-red-500 hover:text-red-700 font-bold">X</button>
                </div>
                <p className="text-gray-600">Target: ${goal.targetAmount.toFixed(2)}</p>
                <p className="text-gray-600">Saved: ${goal.currentAmount.toFixed(2)}</p>
                {goal.targetDate && <p className="text-sm text-gray-500">Deadline: {moment(goal.targetDate).format('ll')}</p>}
                <div className="w-full bg-gray-200 rounded-full h-4 my-2"><div className="bg-green-500 h-4 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div></div>
                <button onClick={() => onUpdateGoal(goal._id, goal.currentAmount)} className="text-sm text-indigo-600 hover:underline mt-auto">Update Saved Amount</button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  );
};

export default Goals;

