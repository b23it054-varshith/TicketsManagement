import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Tickets
export const ticketsAPI = {
  getAll: (params) => api.get('/tickets', { params }),
  getOne: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
  getStats: () => api.get('/tickets/stats'),
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
};

// Users
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getAgents: () => api.get('/users/agents'),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Knowledge Base
export const kbAPI = {
  getAll: (params) => api.get('/kb', { params }),
  getOne: (id) => api.get(`/kb/${id}`),
  create: (data) => api.post('/kb', data),
  update: (id, data) => api.put(`/kb/${id}`, data),
  delete: (id) => api.delete(`/kb/${id}`),
  vote: (id, vote) => api.post(`/kb/${id}/helpful`, { vote }),
};

export default api;
