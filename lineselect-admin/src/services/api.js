import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
  logout: () => api.post('/auth/logout'),
};

// Vehicles API
export const vehiclesAPI = {
  getAll: (params = {}) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  updateStatus: (id, status) => api.patch(`/vehicles/${id}/status`, { status }),
};

// Media API
export const mediaAPI = {
  upload: (vehicleId, formData) => api.post(`/media/upload/${vehicleId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getByVehicle: (vehicleId) => api.get(`/media/vehicle/${vehicleId}`),
  reorder: (mediaItems) => api.put('/media/reorder', { mediaItems }),
  setMain: (id) => api.patch(`/media/${id}/main`),
  delete: (id) => api.delete(`/media/${id}`),
};

// Content API
export const contentAPI = {
  getByPage: (page, language = 'en') => api.get(`/content/${page}`, { params: { language } }),
  update: (page, section, key, data) => api.put(`/content/${page}/${section}/${key}`, data),
  bulkUpdate: (page, content, language = 'en') => api.put(`/content/${page}`, { content, language }),
  getPages: (language = 'en') => api.get('/content', { params: { language } }),
};

export default api;