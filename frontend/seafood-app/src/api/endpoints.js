/**
 * Centralized API endpoints for the seafood application
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    GOOGLE_LOGIN: '/Auth/google-login',
    REGISTER: '/Auth/register',
    FORGOT_PASSWORD: '/Auth/forgot-password',
    RESET_PASSWORD: '/Auth/reset-password',
    CHANGE_PASSWORD: '/Auth/change-password',
    LOGOUT: '/Auth/logout',
  },
  PRODUCTS: {
    RETAIL_LIST: '/products/retail',
    B2B_LIST: '/products/b2b',
    DETAIL: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },
  SUPPLIERS: {
    LIST: '/suppliers',
    DETAIL: (id) => `/suppliers/${id}`,
    FARMS: '/suppliers/farms',
    FARM_DETAIL: (id) => `/suppliers/farms/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    SELLER_ORDERS: '/orders/seller-orders',
    DETAIL: (id) => `/orders/${id}`,
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: (itemId) => `/cart/items/${itemId}`,
    REMOVE: (itemId) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
  }
};
