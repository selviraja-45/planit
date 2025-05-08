import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Required if using cookies/sessions
});

// Add token to headers if exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('planit-token');

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export default API;
