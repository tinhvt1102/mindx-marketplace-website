import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const suppliersApi = {
  list: () => apiClient.get(ENDPOINTS.SUPPLIERS.LIST),
  detail: (id) => apiClient.get(ENDPOINTS.SUPPLIERS.DETAIL(id)),
  farms: () => apiClient.get(ENDPOINTS.SUPPLIERS.FARMS),
  farmDetail: (id) => apiClient.get(ENDPOINTS.SUPPLIERS.FARM_DETAIL(id)),
};
