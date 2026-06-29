/**
 * API Client wrapper using Fetch API with support for:
 * - Base URL configuration via environment variables
 * - Request authorization headers (auto bearer token injection)
 * - Response JSON parsing & error handling
 * - Easy standard HTTP methods (GET, POST, PUT, DELETE)
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Custom error class for API responses
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Main request sender wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Auto-inject Token from localStorage if exists
  const token = localStorage.getItem('token') || localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser') || '{}').token 
    : null;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Check if empty response or text
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle unauthorized (401) token expiration
      if (response.status === 401) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        // You can dispatch a custom event or redirect to login page here if needed
        window.dispatchEvent(new Event('auth-expired'));
      }

      const errorMessage = data?.message || data?.error || `API request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or parsing errors
    throw new ApiError(error.message || 'Lỗi kết nối mạng', 500, null);
  }
}

// HTTP helper methods
export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
