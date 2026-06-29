import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const authApi = {
  /**
   * Log in user with email and password
   */
  login: async (email, password) => {
    return await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  /**
   * Log in with Google token
   */
  googleLogin: async (idToken) => {
    return await apiClient.post(ENDPOINTS.AUTH.GOOGLE_LOGIN, { idToken });
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    return await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
  },

  /**
   * Request forgot password link/code
   */
  forgotPassword: async (email) => {
    return await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    return await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
  },

  /**
   * Change password (requires auth token)
   */
  changePassword: async (oldPassword, newPassword) => {
    return await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, { oldPassword, newPassword });
  },

  /**
   * Log out user (requires auth token)
   */
  logout: async () => {
    return await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  }
};
