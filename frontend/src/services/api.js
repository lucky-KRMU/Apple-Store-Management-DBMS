const BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson);
    } catch {
      errorDetail = response.statusText;
    }
    const err = new Error(errorDetail);
    err.status = response.status;
    throw err;
  }
  return response.json();
}

export const api = {
  checkHealth: async () => {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse(res);
  },

  getStores: async () => {
    const res = await fetch(`${BASE_URL}/stores`);
    return handleResponse(res);
  },

  getStorePerformance: async () => {
    const res = await fetch(`${BASE_URL}/stores/performance`);
    return handleResponse(res);
  },

  getStoreById: async (id) => {
    const res = await fetch(`${BASE_URL}/stores/${id}`);
    return handleResponse(res);
  },

  getDashboardStats: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/dashboard/stats?${query.toString()}`);
    return handleResponse(res);
  },

  getProducts: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.category_id) query.append('category_id', filters.category_id);
    if (filters.search) query.append('search', filters.search);
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
    return handleResponse(res);
  },

  getProductById: async (id, filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/products/${id}?${query.toString()}`);
    return handleResponse(res);
  },

  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    return handleResponse(res);
  },

  createProduct: async (productData) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  updateProduct: async (id, productData) => {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  getInventory: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.status) query.append('status', filters.status);
    if (filters.product_id) query.append('product_id', filters.product_id);
    if (filters.store_id) query.append('store_id', filters.store_id);
    if (filters.search) query.append('search', filters.search);
    const res = await fetch(`${BASE_URL}/inventory?${query.toString()}`);
    return handleResponse(res);
  },

  getInventoryBySerial: async (serial) => {
    const res = await fetch(`${BASE_URL}/inventory/serial/${encodeURIComponent(serial)}`);
    return handleResponse(res);
  },

  getInventorySummary: async () => {
    const res = await fetch(`${BASE_URL}/inventory/summary`);
    return handleResponse(res);
  },

  getInventoryByProduct: async (productId, filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/inventory/by-product/${productId}?${query.toString()}`);
    return handleResponse(res);
  },

  addInventoryItem: async (itemData) => {
    const res = await fetch(`${BASE_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return handleResponse(res);
  },

  updateInventoryStatus: async (serialNumber, updateData) => {
    const res = await fetch(`${BASE_URL}/inventory/${serialNumber}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return handleResponse(res);
  },

  processCheckout: async (payload) => {
    const res = await fetch(`${BASE_URL}/sales/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  getSales: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/sales?${query.toString()}`);
    return handleResponse(res);
  },

  getSaleById: async (id) => {
    const res = await fetch(`${BASE_URL}/sales/${id}`);
    return handleResponse(res);
  },

  getAppointments: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.status) query.append('status', filters.status);
    if (filters.store_id) query.append('store_id', filters.store_id);
    if (filters.search) query.append('search', filters.search);
    const res = await fetch(`${BASE_URL}/appointments?${query.toString()}`);
    return handleResponse(res);
  },

  createAppointment: async (appointmentData) => {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    return handleResponse(res);
  },

  updateAppointment: async (id, updateData) => {
    const res = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return handleResponse(res);
  },

  deleteAppointment: async (id) => {
    const res = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  getEmployees: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.role) query.append('role', filters.role);
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/employees?${query.toString()}`);
    return handleResponse(res);
  },

  createEmployee: async (employeeData) => {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    return handleResponse(res);
  },

  getCustomers: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    const res = await fetch(`${BASE_URL}/customers?${query.toString()}`);
    return handleResponse(res);
  },

  createCustomer: async (customerData) => {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    return handleResponse(res);
  },

  // AppleCare & Warranties
  getWarranty: async (serial) => {
    const res = await fetch(`${BASE_URL}/warranties/${serial}`);
    return handleResponse(res);
  },
  registerWarranty: async (data) => {
    const res = await fetch(`${BASE_URL}/warranties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Trade-In
  getTradeInQuote: async (data) => {
    const res = await fetch(`${BASE_URL}/trade-ins/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getTradeIns: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/trade-ins?${query.toString()}`);
    return handleResponse(res);
  },
  createTradeIn: async (data) => {
    const res = await fetch(`${BASE_URL}/trade-ins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Supply Chain & Transfers
  getTransfers: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/transfers?${query.toString()}`);
    return handleResponse(res);
  },
  createTransfer: async (data) => {
    const res = await fetch(`${BASE_URL}/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateTransferStatus: async (id, data) => {
    const res = await fetch(`${BASE_URL}/transfers/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getReplenishments: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/replenishment?${query.toString()}`);
    return handleResponse(res);
  },
  createReplenishment: async (data) => {
    const res = await fetch(`${BASE_URL}/replenishment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateReplenishmentStatus: async (id, data) => {
    const res = await fetch(`${BASE_URL}/replenishment/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getExecutiveAnalytics: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/analytics/executive?${query.toString()}`);
    return handleResponse(res);
  },
  getCustomerDetails: async (id) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`);
    return handleResponse(res);
  },
  getAudits: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/audits?${query.toString()}`);
    return handleResponse(res);
  },
  createAudit: async (data) => {
    const res = await fetch(`${BASE_URL}/audits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Genius Bar 2.0
  getGeniusParts: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/genius/parts?${query.toString()}`);
    return handleResponse(res);
  },
  useGeniusPart: async (data) => {
    const res = await fetch(`${BASE_URL}/genius/parts/use`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getGeniusQueue: async (store_id) => {
    const res = await fetch(`${BASE_URL}/genius/queue?store_id=${store_id || 'ST-1'}`);
    return handleResponse(res);
  },
  runDiagnostics: async (data) => {
    const res = await fetch(`${BASE_URL}/genius/diagnostics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Today at Apple
  getSessions: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/sessions?${query.toString()}`);
    return handleResponse(res);
  },
  createSession: async (data) => {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  reserveSession: async (data) => {
    const res = await fetch(`${BASE_URL}/sessions/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Audit Logs
  getAuditLogs: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/audit-logs?${query.toString()}`);
    return handleResponse(res);
  },

  // Enterprise Store Floorplan & Zones
  getStoreZones: async (storeId) => {
    const res = await fetch(`${BASE_URL}/floorplan/zones?store_id=${storeId || 'ST-1'}`);
    return handleResponse(res);
  },
  seatCustomerInZone: async (zoneId, data) => {
    const res = await fetch(`${BASE_URL}/floorplan/zones/${zoneId}/seat`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  releaseZoneTable: async (zoneId, data) => {
    const res = await fetch(`${BASE_URL}/floorplan/zones/${zoneId}/release`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Enterprise Specialist Workforce
  getSpecialistTimeLogs: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/specialists/time-logs?${query.toString()}`);
    return handleResponse(res);
  },
  recordTimeClock: async (data) => {
    const res = await fetch(`${BASE_URL}/specialists/time-clock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getSpecialistSchedules: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/specialists/schedules?${query.toString()}`);
    return handleResponse(res);
  },
  createSpecialistSchedule: async (data) => {
    const res = await fetch(`${BASE_URL}/specialists/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getSpecialistPerformance: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/specialists/performance?${query.toString()}`);
    return handleResponse(res);
  },

  // Enterprise Till Reconciliation & Vault Drops
  getCurrentReconciliation: async (storeId) => {
    const res = await fetch(`${BASE_URL}/reconciliation/current?store_id=${storeId || 'ST-1'}`);
    return handleResponse(res);
  },
  closeTillReconciliation: async (data) => {
    const res = await fetch(`${BASE_URL}/reconciliation/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  createVaultDrop: async (data) => {
    const res = await fetch(`${BASE_URL}/reconciliation/vault-drop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Manager Authentication
  verifyManagerPin: async (pin) => {
    const res = await fetch(`${BASE_URL}/manager/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    return handleResponse(res);
  },

  // Profit Margin & COGS Analytics
  getMarginAnalytics: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.store_id) query.append('store_id', filters.store_id);
    const res = await fetch(`${BASE_URL}/analytics/margins?${query.toString()}`);
    return handleResponse(res);
  },

  // Trade-In Diagnostics
  runTradeInDiagnostics: async (data) => {
    const res = await fetch(`${BASE_URL}/trade-ins/diagnostics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Apple Wallet Digital Pass (.pkpass)
  getWalletPass: async (saleId) => {
    const res = await fetch(`${BASE_URL}/sales/${saleId}/wallet-pass`);
    return handleResponse(res);
  }
};

export default api;
