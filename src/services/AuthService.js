import BaseApiService from './BaseApiService';

class AuthService extends BaseApiService {
  async login(username, password) {
    return this.post('/auth/login', { username, password });
  }

  logout() {
    localStorage.removeItem('eira_auth');
    localStorage.removeItem('eira_token');
  }

  isAuthenticated() {
    const auth = localStorage.getItem('eira_auth') === 'true';
    const token = localStorage.getItem('eira_token');
    return auth && !!token;
  }

  getToken() {
    return localStorage.getItem('eira_token');
  }
}

export default new AuthService();
