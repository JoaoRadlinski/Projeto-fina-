import api from './api.js'
export const authService = {
  login(credentials) {
    return api.post('/auth/login', credentials)
  },
  register(payload) {
    return api.post('/auth/register', payload)
  },
  logout() {
    return api.post('/auth/logout')
  },
  me() {
    return api.get('/auth/me')
  },
}
