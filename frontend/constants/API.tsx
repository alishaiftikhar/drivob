import axios from 'axios';

const API_BASE_URL = 'http://192.168.43.20:8000'; // Replace with your actual local IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
