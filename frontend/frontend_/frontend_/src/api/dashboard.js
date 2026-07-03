import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const dashboardApi = {
  seller: () => apiClient.get(ENDPOINTS.DASHBOARD.SELLER),
  admin: () => apiClient.get(ENDPOINTS.DASHBOARD.ADMIN),
};
