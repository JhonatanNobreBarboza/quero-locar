// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://quero-locar-backend-production.up.railway.app/api';


// Create API client with default configuration
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('quero-locar-token');
  }

  // Set auth token
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('quero-locar-token', token);
    } else {
      localStorage.removeItem('quero-locar-token');
    }
  }

  // Get headers with auth token
  getHeaders(includeAuth = true) {
    const headers = { ...this.defaultHeaders };
    
    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.auth !== false),
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

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
