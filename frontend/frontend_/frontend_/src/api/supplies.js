import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const suppliesApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`${ENDPOINTS.SUPPLIES.LIST}${query ? `?${query}` : ''}`);
  },
  detail: (id) => apiClient.get(ENDPOINTS.SUPPLIES.DETAIL(id)),
  create: (data) => apiClient.post(ENDPOINTS.SUPPLIES.CREATE, data),
  mySupplies: () => apiClient.get(ENDPOINTS.SUPPLIES.MY_SUPPLIES),
  update: (id, data) => apiClient.put(ENDPOINTS.SUPPLIES.UPDATE(id), data),
  remove: (id) => apiClient.delete(ENDPOINTS.SUPPLIES.DELETE(id)),
};
