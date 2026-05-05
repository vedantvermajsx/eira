import axios from 'axios';
import appConfig from '../config/env';


class BaseApiService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.VITE_API_BASE_URL,
      timeout: appConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this._attachRequestInterceptor();
    this._attachResponseInterceptor();
  }


  _attachRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('eira_token');
        if (token) {
          config.headers['x-api-key'] = token;
        } else if (appConfig.apiKey) {
          config.headers['x-api-key'] = appConfig.apiKey;
        }

        if (appConfig.debug) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
        }
        return config;
      },
      (error) => {
        if (appConfig.debug) console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );
  }


  _attachResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => {
        if (appConfig.debug) {
          console.log(`[API Response] ${response.status}`, response.data);
        }
        return response.data;
      },
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || 'Unknown error';

        if (status === 401) {
          console.warn('[API Auth] Unauthorized access detected. Clearing session.');
          localStorage.removeItem('eira_auth');
          localStorage.removeItem('eira_token');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        if (appConfig.debug) {
          console.error(`[API Error] ${status}: ${message}`, error);
        }

        const normalizedError = {
          status,
          message,
          originalError: error,
        };

        return Promise.reject(normalizedError);
      }
    );
  }

  async get(endpoint, params = {}) {
    return this.client.get(endpoint, { params });
  }

  async post(endpoint, data = {}) {
    return this.client.post(endpoint, data);
  }

  async put(endpoint, data = {}) {
    return this.client.put(endpoint, data);
  }

  async patch(endpoint, data = {}) {
    return this.client.patch(endpoint, data);
  }

  async delete(endpoint) {
    return this.client.delete(endpoint);
  }
}

export default BaseApiService;
