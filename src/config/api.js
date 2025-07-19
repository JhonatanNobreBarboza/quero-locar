// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://quero-locar-backend-production.up.railway.app/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  getAuthToken() {
    return localStorage.getItem('quero-locar-token');
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('quero-locar-token', token);
    } else {
      localStorage.removeItem('quero-locar-token');
    }
  }

  getHeaders(endpoint, includeAuth = true) {
    const headers = { ...this.defaultHeaders };

    if (includeAuth && !endpoint.includes('/auth/login')) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(endpoint, options.auth !== false),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

const apiClient = new ApiClient();
export default apiClient;
