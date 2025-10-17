import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative mr-4">
                <span role="img" aria-label="Notifications">🔔</span>
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg text-black p-4 z-10">
                    <h4 className="font-bold mb-2">Notifications</h4>
                    {notifications.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                            {notifications.map((n, i) => <li key={i}>{n.message}</li>)}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No new notifications.</p>
                    )}
                </div>
            )}
        </div>
    );
};


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">FinanceManager</Link>
        <div className="flex items-center">
          {user && (
            <>
              <Link to="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
              <Link to="/budgets" className="mr-4 hover:text-gray-300">Budgets</Link>
              <Link to="/goals" className="mr-4 hover:text-gray-300">Goals</Link>
              <Link to="/forecast" className="mr-4 hover:text-gray-300">Forecast</Link>
              <Link to="/reports" className="mr-4 hover:text-gray-300">Reports</Link>
              <Link to="/recurring" className="mr-4 hover:text-gray-300">Recurring</Link>
              <Link to="/profile" className="mr-4 hover:text-gray-300">Profile</Link>
              <NotificationsDropdown />
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

