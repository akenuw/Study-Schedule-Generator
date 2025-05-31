import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Preferences
  getPreferences: () => api.get('/preferences'),
  savePreferences: (preferences) => api.post('/preferences', preferences),

  // Schedule generation
  generateSchedule: (preferences) => api.post('/schedule/generate', preferences),
  exportSchedule: (schedule, filename) => api.post('/schedule/export', { schedule, filename }),

  // Schedule history
  getSchedules: () => api.get('/schedules'),

  // Study tips
  getStudyTips: (preferences) => api.post('/tips', preferences),
};

export default api;
