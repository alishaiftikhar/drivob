// File: constants/API.js
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.7:8000/api'; // ✅ Correct base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;