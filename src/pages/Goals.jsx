import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import moment from 'moment';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

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

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    try {
      const res = await api.post('/goals', { name, targetAmount: Number(targetAmount), deadline });
      setGoals([...goals, res.data]);
      setName('');
      setTargetAmount('');
      setDeadline('');
    } catch (err) {
      console.error("Failed to add goal", err);
    }
  };
  
  const handleDeleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch(err) {
      console.error("Failed to delete goal", err);
    }
  }

  // A simple way to update a goal's current amount
  const handleUpdateGoal = async (id, currentAmount) => {
    const contribution = prompt("Enter amount to add to this goal:", "0");
    if (contribution === null || isNaN(contribution) || Number(contribution) <= 0) return;

    const newCurrentAmount = currentAmount + Number(contribution);
    try {
      const res = await api.put(`/goals/${id}`, { currentAmount: newCurrentAmount });
      setGoals(goals.map(g => g._id === id ? res.data : g));
    } catch (err) {
      console.error("Failed to update goal", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Financial Goals</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Set a New Goal</h2>
          <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="w-full">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Vacation Fund" className="mt-1 w-full p-2 border rounded-md shadow-sm" required />
            </div>
            <div className="w-full">
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Target Amount</label>
              <input type="number" id="targetAmount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="e.g., 2000" className="mt-1 w-full p-2 border rounded-md shadow-sm" required />
            </div>
             <div className="w-full">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline (Optional)</label>
              <input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 w-full p-2 border rounded-md shadow-sm" />
            </div>
            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Goal</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Goals</h2>
          <div className="space-y-4">
            {goals.length > 0 ? goals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                        <span className="font-bold text-lg text-gray-700">{goal.name}</span>
                        {goal.deadline && <p className="text-sm text-gray-500">Deadline: {moment(goal.deadline).format("MMMM Do, YYYY")}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                      <button onClick={() => handleUpdateGoal(goal._id, goal.currentAmount)} className="text-green-500 hover:text-green-700 font-semibold">Add Funds</button>
                      <button onClick={() => handleDeleteGoal(goal._id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                  </div>
                </div>
              );
            }) : <p className="text-gray-500">No goals set yet.</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Goals;
