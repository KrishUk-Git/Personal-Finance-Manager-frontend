// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Finance Manager</h1>
                {user && (
                     <button onClick={onLogout} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;