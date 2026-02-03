import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Return the error message from server
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      return Promise.reject(error);
    }
  }
);

// ============ AUTH API ============
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, otp, password) => api.post('/auth/reset-password', { email, otp, password }),
  updatePassword: (currentPassword, newPassword) => api.put('/auth/update-password', { currentPassword, newPassword }),
};

// ============ DASHBOARD API ============
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenue: () => api.get('/dashboard/revenue'),
  getActivities: (limit = 10) => api.get(`/dashboard/activities?limit=${limit}`),
  getWeeklySales: () => api.get('/dashboard/weekly-sales'),
};

// ============ CLIENTS API ============
export const clientsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.membershipType) queryParams.append('membershipType', params.membershipType);
    if (params.assignedTrainer) queryParams.append('assignedTrainer', params.assignedTrainer);
    if (params.sort) queryParams.append('sort', params.sort);
    return api.get(`/clients?${queryParams.toString()}`);
  },
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getAttendance: (id, params = {}) => api.get(`/clients/${id}/attendance`, { params }),
  addAttendance: (id, data) => api.post(`/clients/${id}/attendance`, data),
  getProgress: (id) => api.get(`/clients/${id}/progress`),
  addProgress: (id, data) => api.post(`/clients/${id}/progress`, data),
  getPayments: (id, params = {}) => api.get(`/clients/${id}/payments`, { params }),
};

// ============ TRAINERS API ============
export const trainersAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.specialty) queryParams.append('specialty', params.specialty);
    if (params.sort) queryParams.append('sort', params.sort);
    return api.get(`/trainers?${queryParams.toString()}`);
  },
  getStats: () => api.get('/trainers/stats'),
  getById: (id) => api.get(`/trainers/${id}`),
  create: (data) => api.post('/trainers', data),
  update: (id, data) => api.put(`/trainers/${id}`, data),
  delete: (id) => api.delete(`/trainers/${id}`),
  getClients: (id, params = {}) => api.get(`/trainers/${id}/clients`, { params }),
  getSchedule: (id, params = {}) => api.get(`/trainers/${id}/schedule`, { params }),
  addSession: (id, data) => api.post(`/trainers/${id}/schedule`, data),
  processSalary: (id, data) => api.post(`/trainers/${id}/salary`, data),
  updateStatus: (id, status) => api.patch(`/trainers/${id}/status`, { status }),
};

// ============ PAYMENTS API ============
export const paymentsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.paymentType) queryParams.append('paymentType', params.paymentType);
    if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.sort) queryParams.append('sort', params.sort);
    return api.get(`/payments?${queryParams.toString()}`);
  },
  getStats: () => api.get('/payments/stats'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  updateStatus: (id, status) => api.patch(`/payments/${id}/status`, { status }),
  processRefund: (id, data) => api.post(`/payments/${id}/refund`, data),
  sendReceipt: (id) => api.post(`/payments/${id}/receipt`),
  export: (params = {}) => api.get('/payments/export', { params }),
};

// ============ NOTIFICATIONS API ============
export const notificationsAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearRead: () => api.delete('/notifications/clear-read'),
};

// ============ USERS API ============
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePreferences: (data) => api.put('/users/preferences', data),
  changePassword: (currentPassword, newPassword) => api.put('/users/password', { currentPassword, newPassword }),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  toggle2FA: (enabled) => api.put('/users/2fa', { enabled }),
  getAll: () => api.get('/users'),
  deactivate: (id) => api.put(`/users/${id}/deactivate`),
};

// ============ ANALYTICS API ============
export const analyticsAPI = {
  getWeeklySales: (period = 'week') => api.get(`/analytics/sales?period=${period}`),
  getRevenueByType: () => api.get('/analytics/revenue-by-type'),
  getMembershipDistribution: () => api.get('/analytics/membership-distribution'),
  getClientGrowth: () => api.get('/analytics/client-growth'),
  getTrainerPerformance: () => api.get('/analytics/trainer-performance'),
  getTrafficSources: () => api.get('/analytics/traffic-sources'),
};

export default api;
