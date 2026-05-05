/**
 * Environment configuration
 * Supports 'development' and 'production' environments
 */

const ENV = import.meta.env.VITE_ENV || 'development';

const config = {
  development: {
    env: 'development',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    apiKey: null, // No API key needed in dev
    mongoUri: null, // Not exposed to frontend in dev
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
    debug: true,
  },
  production: {
    env: 'production',
    apiBaseUrl: '/api',
    apiKey: import.meta.env.VITE_API_KEY,
    mongoUri: import.meta.env.VITE_MONGODB_URI, 
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
    debug: false,
  },
};

export const appConfig = config[ENV] || config.development;
export default appConfig;
