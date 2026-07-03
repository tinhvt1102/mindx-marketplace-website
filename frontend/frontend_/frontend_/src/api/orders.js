import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';

export const ordersApi = {
  create: (data) => apiClient.post(ENDPOINTS.ORDERS.CREATE, data),
  myOrders: () => apiClient.get(ENDPOINTS.ORDERS.MY_ORDERS),
  sellerOrders: () => apiClient.get(ENDPOINTS.ORDERS.SELLER_ORDERS),
  detail: (id) => apiClient.get(ENDPOINTS.ORDERS.DETAIL(id)),
  updateStatus: (id, data) => apiClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS(id), data),
};
