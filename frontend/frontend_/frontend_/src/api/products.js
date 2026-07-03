import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const productsApi = {
  getRetail: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`${ENDPOINTS.PRODUCTS.RETAIL_LIST}${query ? `?${query}` : ''}`);
  },
  getDetail: (id) => apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(id)),
  create: (data) => apiClient.post(ENDPOINTS.PRODUCTS.CREATE, data),
  getMyProducts: () => apiClient.get(ENDPOINTS.PRODUCTS.MY_PRODUCTS),
  update: (id, data) => apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(id), data),
  remove: (id) => apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id)),
};
