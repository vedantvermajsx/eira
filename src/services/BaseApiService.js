import axios from 'axios';
import appConfig from '../config/env';

/**
 * Base API Service - Handles axios instance, interceptors, and HTTP methods
 */
class BaseApiService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://eira-8d4w.onrender.com/api",
      timeout: appConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Inject API key only in production
        ...(appConfig.apiKey && { 'x-api-key': appConfig.apiKey }),
      },
    });

    this._attachRequestInterceptor();
    this._attachResponseInterceptor();
  }

  /** Attach request interceptor — log in dev, inject auth in prod */
  _attachRequestInterceptor() {
    this.client.interceptors.request.use(
      (config) => {
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

  /** Attach response interceptor — normalize errors */
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
