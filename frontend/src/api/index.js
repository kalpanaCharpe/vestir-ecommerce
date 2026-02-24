import api from './axios'

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  logout: () => api.post('/users/profile'),
  deleteProfile: () => api.delete('/users/profile'),
  getAllUsers: () => api.get('/users'),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
}

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
}

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (data) => api.put('/cart/update', data),
  remove: (data) => api.delete('/cart/remove', { data }),
  clear: () => api.delete('/cart/clear'),
}

export const orderAPI = {
  place: (data) => api.post('/orders/place', data),
  getUserOrders: () => api.get('/orders/user'),
  deleteOrder: (orderId) => api.delete(`/orders/${orderId}`),
  getAllOrders: () => api.get('/orders/'),
  updateStatus: (orderId, data) => api.put(`/orders/${orderId}`, data),
}
