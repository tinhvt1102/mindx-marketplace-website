import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const cartApi = {
  get: () => apiClient.get(ENDPOINTS.CART.GET),
  add: (data) => apiClient.post(ENDPOINTS.CART.ADD, data),
  update: (itemId, data) => apiClient.put(ENDPOINTS.CART.UPDATE(itemId), data),
  remove: (itemId) => apiClient.delete(ENDPOINTS.CART.REMOVE(itemId)),
  clear: () => apiClient.delete(ENDPOINTS.CART.CLEAR),
};
