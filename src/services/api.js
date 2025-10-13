import axios from 'axios';

const api = axios.create({
  baseURL: 'https://personal-finance-manager-backend-4uij.onrender.com/api', // Your live backend URL
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
