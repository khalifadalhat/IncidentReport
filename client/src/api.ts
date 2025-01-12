import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers['Requires-Auth']) {
      config.headers['Authorization'] = `Bearer ${token}`;
      delete config.headers['Requires-Auth']; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

export default api;