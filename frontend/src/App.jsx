import React, { useState, useEffect } from "react";
import { 
  Apple, MapPin, RefreshCw, ChevronDown, LayoutDashboard, Package, ShoppingBag, Wrench, Users, DollarSign, TrendingUp, CheckCircle2, Building2, Globe2, Search, Plus, Hash, ArrowRight, X, Trash2, ShieldCheck, AlertCircle, Printer, Calendar, Shield, Award, Briefcase, Mail, UserCheck 
} from "lucide-react";
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

const api = {
  
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

  
  getInventory: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.status) query.append('status', filters.status);
    if (filters.product_id) query.append('product_id', filters.product_id);
    if (filters.store_id) query.append('store_id', filters.store_id);
    if (filters.search) query.append('search', filters.search);
    const res = await fetch(`${BASE_URL}/inventory?${query.toString()}`);
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
  }
};

export function DashboardView({ stats, currentStore, onNavigateToPOS, onNavigateToGenius }) {
  const metrics = stats?.metrics || {
    totalInventory: 0,
    inStockInventory: 0,
    soldInventory: 0,
    reservedInventory: 0,
    todaysRevenue: 0,
    totalRevenue: 0,
    todaysSalesCount: 0,
    totalSalesCount: 0,
    activeRepairs: 0,
    inProgressRepairs: 0
  };

  const categoryBreakdown = stats?.categoryBreakdown || [];
  const activityFeed = stats?.activityFeed || [];
  const storePerformance = stats?.storePerformance || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {currentStore ? currentStore.name : 'Dashboard'}
            </h1>
            {currentStore?.flagship && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Flagship Store
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">
            {currentStore 
              ? `${currentStore.city}, ${currentStore.country} • Store ID: ${currentStore.store_id} • Sales Tax: ${(parseFloat(currentStore.tax_rate) * 100).toFixed(2)}%`
              : 'Overview across all 75 international stores.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToPOS}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span>New Sale</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-zinc-900 border border-zinc-800 shadow-apple-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Live Inventory</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight">
              {metrics.inStockInventory} <span className="text-sm font-normal text-zinc-400">units available</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
              <span className="text-emerald-400 font-medium">{metrics.soldInventory} sold</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{metrics.reservedInventory} reserved</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-zinc-900 border border-zinc-800 shadow-apple-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Store Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight font-mono">
              ${Number(metrics.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{metrics.totalSalesCount.toLocaleString()} transactions recorded</span>
            </div>
          </div>
        </div>

        <div 
          onClick={onNavigateToGenius}
          className="p-5 rounded-lg bg-zinc-900 border border-zinc-800 shadow-apple-sm flex flex-col justify-between cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Genius Bar Repairs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight">
              {metrics.activeRepairs} <span className="text-sm font-normal text-zinc-400">active tickets</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-purple-400 font-medium">
              <span>{metrics.inProgressRepairs} in diagnostics</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-zinc-900 border border-zinc-800 shadow-apple-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Retail Location</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-800/60">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-white tracking-tight truncate">
              {currentStore ? currentStore.store_id : '75 Stores'}
            </div>
            <div className="mt-1 text-xs text-zinc-400 truncate">
              {currentStore ? `${currentStore.city}, ${currentStore.country}` : 'All Locations'}
            </div>
          </div>
        </div>
      </div>

      {!currentStore && storePerformance.length > 0 && (
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-400" />
                Store Performance
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Store sales volume and total revenue.</p>
            </div>
            
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-800/80 text-zinc-500 font-medium">
                  <th className="py-2.5 px-3">Store</th>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Tax Rate</th>
                  <th className="py-2.5 px-3 text-right">In-Stock Units</th>
                  <th className="py-2.5 px-3 text-right">Sales Count</th>
                  <th className="py-2.5 px-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {storePerformance.map((st) => (
                  <tr key={st.store_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-zinc-100 flex items-center gap-1.5">
                      <span>{st.store_name}</span>
                      {st.flagship && <span className="text-amber-400 text-[10px]">★</span>}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400">{st.store_id}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{st.city}, {st.country}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400">{(parseFloat(st.tax_rate) * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-medium">
                      {st.in_stock_units}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-300">
                      {st.total_sales_count}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">
                      ${Number(st.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-900 border border-zinc-800 shadow-apple-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Inventory by Category</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {currentStore ? `Stock localized at ${currentStore.name}` : 'Stock distribution and valuation across categories.'}
              </p>
            </div>
            <span className="text-xs font-medium text-zinc-500">
              {categoryBreakdown.length} Categories
            </span>
          </div>

          <div className="space-y-3.5">
            {categoryBreakdown.map((cat) => {
              const inStock = parseInt(cat.in_stock_units, 10) || 0;
              const total = parseInt(cat.total_units, 10) || 1;
              const percent = Math.min(100, Math.round((inStock / (total || 1)) * 100));

              return (
                <div key={cat.category_id} className="p-3.5 rounded-lg bg-zinc-950 hover:bg-zinc-950 transition-colors border border-zinc-800/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-zinc-200 text-sm">{cat.category_name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500">{inStock} in stock / {total} total</span>
                      <span className="font-semibold text-white font-mono">
                        ${Number(cat.stock_value || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 font-mono text-zinc-300 border border-zinc-800/60">Live</span>
            </div>

            <div className="mt-4 space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
              {activityFeed.length === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center">No recent activity recorded.</p>
              ) : (
                activityFeed.map((item, idx) => {
                  const isSale = item.type === 'sale';
                  return (
                    <div key={`${item.id}-${idx}`} className="flex items-start gap-3 text-xs">
                      <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSale ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {isSale ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-zinc-200 truncate">{item.customer_name}</span>
                          {isSale && (
                            <span className="font-semibold text-white font-mono">
                              +${Number(item.amount).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 text-[11px] truncate mt-0.5">{item.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1">
                          <span className="font-mono">{item.ref}</span>
                          {item.store_name && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-400 font-medium truncate">{item.store_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 text-center">
            Real-time updates
          </div>
        </div>
      </div>
    </div>
  );
}

function SerialInventoryModal({ product, selectedStoreId, stores, onClose, onRefresh }) {
  const [serials, setSerials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newSerial, setNewSerial] = useState('');
  const [targetStoreId, setTargetStoreId] = useState(selectedStoreId || (stores[0]?.store_id || 'ST-1'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product?.product_id) {
      loadSerials();
    }
  }, [product, selectedStoreId]);

  const loadSerials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getInventoryByProduct(product.product_id, selectedStoreId ? { store_id: selectedStoreId } : {});
      setSerials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (serialNumber, nextStatus) => {
    try {
      await api.updateInventoryStatus(serialNumber, { status: nextStatus });
      await loadSerials();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleRegisterSerial = async (e) => {
    e.preventDefault();
    if (!newSerial.trim()) return;

    try {
      setIsSubmitting(true);
      await api.addInventoryItem({
        serial_number: newSerial.trim().toUpperCase(),
        product_id: String(product.product_id),
        store_id: String(targetStoreId),
        status: 'In Stock'
      });
      setNewSerial('');
      await loadSerials();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            In Stock
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Reserved
          </span>
        );
      case 'Sold':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            Sold
          </span>
        );
      case 'In Repair':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            In Repair
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-zinc-800 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-zinc-800/80 flex items-start justify-between">
          <div className="flex items-center gap-4">
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-14 h-14 rounded-lg object-cover bg-zinc-950 border border-zinc-800" 
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-zinc-500">{product.category_name}</span>
                <span className="text-xs text-zinc-600">•</span>
                <span className="text-xs font-mono font-medium text-zinc-400">ID #{product.product_id}</span>
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight">{product.name}</h2>
              <div className="text-xs text-zinc-400 font-mono mt-0.5">
                ${Number(product.base_price).toLocaleString()} MSRP
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {product.specs && typeof product.specs === 'object' && (
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs">
              <span className="font-semibold text-zinc-300 block mb-1.5">Hardware Specifications:</span>
              <div className="grid grid-cols-2 gap-2 text-zinc-400">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key}>
                    <span className="capitalize text-zinc-500">{key}: </span>
                    <span className="font-medium text-zinc-300">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-zinc-400" />
                Units in Stock ({serials.length})
              </h3>
              <span className="text-xs text-zinc-500">
                {selectedStoreId ? `Filtered to store: ${selectedStoreId}` : 'All stores'}
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading serialized inventory...</div>
            ) : error ? (
              <div className="py-4 text-center text-xs text-red-400 bg-red-500/10 rounded-xl">{error}</div>
            ) : serials.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded-lg border border-dashed border-zinc-800">
                No physical serial units assigned at this location.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04] border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-950 max-h-60 overflow-y-auto">
                {serials.map((item) => (
                  <div key={item.serial_number} className="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-900 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-white">
                          {item.serial_number}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
                        <span className="font-medium text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {item.store_name || item.store_location}
                        </span>
                        <span>•</span>
                        <span>Rec. {new Date(item.received_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {item.status !== 'Sold' && (
                      <div className="flex items-center gap-1.5 text-xs">
                        {item.status !== 'In Stock' && (
                          <button
                            onClick={() => handleStatusChange(item.serial_number, 'In Stock')}
                            className="px-2 py-1 rounded-lg text-emerald-400 hover:bg-emerald-500/10 text-[11px] font-medium border border-emerald-500/20"
                          >
                            In Stock
                          </button>
                        )}
                        {item.status !== 'Reserved' && (
                          <button
                            onClick={() => handleStatusChange(item.serial_number, 'Reserved')}
                            className="px-2 py-1 rounded-lg text-amber-400 hover:bg-amber-500/10 text-[11px] font-medium border border-amber-500/20"
                          >
                            Reserve
                          </button>
                        )}
                        {item.status !== 'In Repair' && (
                          <button
                            onClick={() => handleStatusChange(item.serial_number, 'In Repair')}
                            className="px-2 py-1 rounded-lg text-purple-400 hover:bg-purple-500/10 text-[11px] font-medium border border-purple-500/20"
                          >
                            Repair
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleRegisterSerial} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-3">
            <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              Add New Serial Unit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="Serial (e.g. F17ST1P1Q999)"
                value={newSerial}
                onChange={(e) => setNewSerial(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white font-mono focus:outline-none focus:border-white/30"
                required
              />
              <select
                value={targetStoreId}
                onChange={(e) => setTargetStoreId(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-white font-medium focus:outline-none focus:border-white/30"
              >
                {stores.map((st) => (
                  <option key={st.store_id} value={st.store_id} className="bg-zinc-900">
                    {st.store_id} — {st.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isSubmitting || !newSerial.trim()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Registering...' : 'Add Serial'}
              </button>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function AddProductModal({ categories, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: categories[0]?.category_id || 'CAT-1',
    base_price: '',
    image_url: '',
    chip: '',
    storage: '',
    color: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      const specs = {};
      if (formData.chip) specs.chip = formData.chip;
      if (formData.storage) specs.storage = formData.storage;
      if (formData.color) specs.color = formData.color;

      await api.createProduct({
        name: formData.name,
        category_id: String(formData.category_id),
        base_price: parseFloat(formData.base_price),
        specs,
        image_url: formData.image_url || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80'
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Add New Apple Product</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. iPad Air 11-inch M2 128GB Space Gray"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
              >
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id} className="bg-zinc-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Base Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="599.00"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/30 border border-zinc-800 space-y-2">
            <span className="font-semibold text-zinc-300 block">Specifications</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Chip (M2 / A18)"
                value={formData.chip}
                onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30"
              />
              <input
                type="text"
                placeholder="Storage (256GB)"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30"
              />
              <input
                type="text"
                placeholder="Color (Space Gray)"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="px-2.5 py-1.5 rounded-lg bg-black/50 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InventoryView({ products, categories, stores, selectedStoreId, onRefresh }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductForSerials, setSelectedProductForSerials] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !selectedCategory || String(p.category_id) === String(selectedCategory);
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.specs && JSON.stringify(p.specs).toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Inventory & Products Catalog</h1>
            {currentStore && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                {currentStore.name} ({currentStore.store_id})
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">
            {currentStore 
              ? `Displaying serialized hardware units at ${currentStore.name}.`
              : 'Product catalog and serialized hardware units.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800 shadow-apple-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-white text-black shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700/80'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                String(selectedCategory) === String(cat.category_id)
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700/80'
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const inStock = parseInt(product.in_stock_count, 10) || 0;
          const totalUnits = parseInt(product.total_units, 10) || 0;

          return (
            <div
              key={product.product_id}
              className="group bg-zinc-900 rounded-xl border border-zinc-800 shadow-apple-sm hover:border-white/20 hover:bg-zinc-900 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="aspect-[4/3] rounded-lg bg-zinc-950 overflow-hidden relative mb-4 border border-zinc-800/80 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="text-zinc-600 text-xs">No Image</div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/80 backdrop-blur-md text-zinc-300 border border-zinc-800">
                      {product.category_name}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-white tracking-tight leading-snug line-clamp-2">
                  {product.name}
                </h3>

                {product.specs && typeof product.specs === 'object' && (
                  <div className="mt-2.5 flex flex-wrap gap-1 text-[10px] text-zinc-400">
                    {product.specs.chip && (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-mono text-zinc-300">
                        {product.specs.chip}
                      </span>
                    )}
                    {product.specs.display && (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                        {product.specs.display}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-5 pt-0 mt-auto border-t border-zinc-800/80 bg-zinc-950/80">
                <div className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">MSRP</span>
                    <span className="font-semibold text-sm text-white font-mono">
                      ${Number(product.base_price).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-zinc-500 text-[11px] block">
                      {currentStore ? 'In Store' : 'Available'}
                    </span>
                    <span className={`font-semibold text-xs font-mono ${
                      inStock > 0 ? 'text-emerald-400' : 'text-zinc-500'
                    }`}>
                      {inStock} Units
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProductForSerials(product)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium transition-colors"
                >
                  <Hash className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Inspect Serials ({totalUnits})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 ml-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center bg-zinc-900 rounded-xl border border-zinc-800 p-8">
          <p className="text-zinc-400 text-sm">No products found matching the search criteria.</p>
        </div>
      )}

      {selectedProductForSerials && (
        <SerialInventoryModal
          product={selectedProductForSerials}
          selectedStoreId={selectedStoreId}
          stores={stores}
          onClose={() => setSelectedProductForSerials(null)}
          onRefresh={onRefresh}
        />
      )}

      {isAddModalOpen && (
        <AddProductModal
          categories={categories}
          onClose={() => setIsAddModalOpen(false)}
          onCreated={() => {
            setIsAddModalOpen(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function ReceiptModal({ sale, onClose }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800 flex flex-col max-h-[92vh]">
        <div className="p-6 text-center border-b border-zinc-800/80 relative bg-zinc-950">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Apple className="w-5 h-5 fill-current text-black" />
          </div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            {sale.store_name || 'Apple Retail Store'}
          </h2>
          <p className="text-[11px] text-zinc-400">{sale.store_location || sale.store_address || 'Official Retail Network'}</p>
          {sale.store_phone && <p className="text-[10px] text-zinc-500">{sale.store_phone}</p>}
          
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Transaction Approved
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="space-y-1.5 text-zinc-400 pb-3 border-b border-dashed border-zinc-800">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-semibold text-white">{sale.receipt_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="text-zinc-300">{new Date(sale.sale_date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="text-white">{sale.customer_name}</span>
            </div>
            {sale.customer_email && (
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="text-zinc-400">{sale.customer_email}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Specialist:</span>
              <span className="text-zinc-300">{sale.employee_name} ({sale.badge_number || 'Staff'})</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="text-zinc-300">{sale.payment_method}</span>
            </div>
          </div>

          <div className="space-y-3 pb-3 border-b border-dashed border-zinc-800">
            <span className="text-[11px] font-sans font-semibold text-zinc-500 uppercase tracking-wider block">
              Purchased Items
            </span>
            {sale.items?.map((item) => (
              <div key={item.sale_item_id} className="space-y-0.5">
                <div className="flex justify-between font-sans font-medium text-white text-xs">
                  <span className="truncate pr-2">{item.product_name}</span>
                  <span className="font-mono">${Number(item.unit_price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>Serial: <span className="font-mono text-zinc-300 font-semibold">{item.serial_number}</span></span>
                  <span>1 unit</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span>${Number(sale.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Tax:</span>
              <span>${Number(sale.tax_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
              <span>TOTAL:</span>
              <span className="text-emerald-400">${Number(sale.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-3 text-[10px] text-zinc-500 text-center space-y-1 font-sans">
            <p>Please retain receipt for AppleCare+ warranty.</p>
            <p className="font-semibold text-zinc-400">Thank you for shopping with Apple.</p>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex gap-2 justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-800 text-zinc-200 text-xs font-medium hover:bg-zinc-750"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export function POSCheckoutView({ products, stores, selectedStoreId, onCheckoutComplete }) {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeStoreId, setActiveStoreId] = useState(selectedStoreId || (stores[0]?.store_id || 'ST-1'));
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Apple Pay');
  const [useStoredProcedure, setUseStoredProcedure] = useState(false);

  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [availableSerials, setAvailableSerials] = useState([]);
  const [selectedSerial, setSelectedSerial] = useState('');
  const [loadingSerials, setLoadingSerials] = useState(false);

  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [completedSale, setCompletedSale] = useState(null);

  useEffect(() => {
    if (selectedStoreId) {
      setActiveStoreId(selectedStoreId);
    }
  }, [selectedStoreId]);

  useEffect(() => {
    loadCustomersAndStaff();
  }, [activeStoreId]);

  const loadCustomersAndStaff = async () => {
    try {
      const [custData, empData] = await Promise.all([
        api.getCustomers(),
        api.getEmployees({ role: 'Specialist', store_id: activeStoreId })
      ]);
      setCustomers(custData);
      if (custData.length > 0 && !selectedCustomerId) setSelectedCustomerId(custData[0].customer_id);

      setEmployees(empData);
      if (empData.length > 0) {
        setSelectedEmployeeId(empData[0].employee_id);
      } else {
        setSelectedEmployeeId('');
      }
    } catch (err) {
      console.error('Failed to load customers/employees:', err);
    }
  };

  const currentStore = stores.find(s => String(s.store_id) === String(activeStoreId)) || stores[0];
  const taxRate = currentStore ? parseFloat(currentStore.tax_rate) : 0.08875;

  const handleProductSelect = async (productId) => {
    setSelectedProductId(productId);
    setSelectedSerial('');
    if (!productId) {
      setAvailableSerials([]);
      return;
    }

    try {
      setLoadingSerials(true);
      const items = await api.getInventoryByProduct(productId, { store_id: activeStoreId });
      const currentSerialsInCart = cart.map(c => c.serial_number);
      const inStock = items.filter(i => i.status === 'In Stock' && !currentSerialsInCart.includes(i.serial_number));
      setAvailableSerials(inStock);
      if (inStock.length > 0) {
        setSelectedSerial(inStock[0].serial_number);
      }
    } catch (err) {
      console.error('Failed to fetch product serials:', err);
    } finally {
      setLoadingSerials(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProductId || !selectedSerial) return;

    const product = products.find(p => String(p.product_id) === String(selectedProductId));
    if (!product) return;

    setCart(prev => [
      ...prev,
      {
        product,
        serial_number: selectedSerial,
        price: parseFloat(product.base_price)
      }
    ]);

    setSelectedProductId('');
    setSelectedSerial('');
    setAvailableSerials([]);
  };

  const handleRemoveFromCart = (index) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!selectedCustomerId || !selectedEmployeeId) {
      setCheckoutError('Please select both a Customer and an Apple Specialist for this store.');
      return;
    }

    try {
      setIsProcessing(true);
      setCheckoutError(null);

      const payload = {
        store_id: String(activeStoreId),
        customer_id: parseInt(selectedCustomerId, 10),
        employee_id: parseInt(selectedEmployeeId, 10),
        serial_numbers: cart.map(item => item.serial_number),
        payment_method: paymentMethod,
        use_stored_proc: useStoredProcedure
      };

      const result = await api.processCheckout(payload);
      setCompletedSale(result.sale);
      setCart([]);
      if (onCheckoutComplete) onCheckoutComplete();
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createCustomer({
        name: newCustomerName,
        email: newCustomerEmail,
        phone: newCustomerPhone
      });
      setCustomers(prev => [...prev, created]);
      setSelectedCustomerId(created.customer_id);
      setShowNewCustomerModal(false);
      setNewCustomerName('');
      setNewCustomerEmail('');
      setNewCustomerPhone('');
    } catch (err) {
      alert(`Customer registration failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Point of Sale (POS)</h1>
            {currentStore && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {currentStore.name} ({currentStore.store_id})
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">
            Atomic sales checkout backed by database transaction isolation (`BEGIN`, `FOR UPDATE`, `COMMIT`).
          </p>
        </div>
      </div>

      {checkoutError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{checkoutError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 shadow-apple-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                Store Location & Staffing
              </h2>
              <span className="text-xs text-zinc-400 font-mono">
                Tax: {(taxRate * 100).toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-400 mb-1.5">Fulfillment Store</label>
                <select
                  value={activeStoreId}
                  onChange={(e) => setActiveStoreId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-medium focus:outline-none focus:border-white/30"
                >
                  {stores.map((st) => (
                    <option key={st.store_id} value={st.store_id} className="bg-zinc-900">
                      {st.store_id} — {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-400 mb-1.5">Apple Specialist</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-medium focus:outline-none focus:border-white/30"
                >
                  {employees.length === 0 ? (
                    <option value="">No specialists</option>
                  ) : (
                    employees.map((e) => (
                      <option key={e.employee_id} value={e.employee_id} className="bg-zinc-900">
                        {e.name} ({e.badge_number})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-medium text-zinc-400">Customer</label>
                  <button
                    type="button"
                    onClick={() => setShowNewCustomerModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-[11px] font-medium"
                  >
                    + New
                  </button>
                </div>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-medium focus:outline-none focus:border-white/30"
                >
                  {customers.map((c) => (
                    <option key={c.customer_id} value={c.customer_id} className="bg-zinc-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 shadow-apple-sm space-y-4">
            <h2 className="text-sm font-semibold text-white">Add Product to Cart</h2>
            <p className="text-xs text-zinc-400">
              Available in stock at <span className="font-medium text-white">{currentStore?.name}</span>.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-400 mb-1.5">Select Device Model</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-medium focus:outline-none focus:border-white/30"
                >
                  <option value="" className="bg-zinc-900">-- Select a Product --</option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id} className="bg-zinc-900">
                      {p.name} — ${Number(p.base_price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-3">
                  {loadingSerials ? (
                    <p className="text-zinc-500">Checking inventory at {currentStore?.name}...</p>
                  ) : availableSerials.length === 0 ? (
                    <p className="text-amber-400 font-medium">No units in stock at this location.</p>
                  ) : (
                    <>
                      <div>
                        <label className="block font-medium text-zinc-300 mb-1.5">
                          Select Serial Number ({availableSerials.length} available)
                        </label>
                        <select
                          value={selectedSerial}
                          onChange={(e) => setSelectedSerial(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                        >
                          {availableSerials.map((s) => (
                            <option key={s.serial_number} value={s.serial_number} className="bg-zinc-900">
                              {s.serial_number} ({s.store_name})
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!selectedSerial}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4 text-black" />
                        <span>Add Unit to Cart</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 shadow-apple-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                Cart ({cart.length})
              </h2>
              <span className="text-xs text-zinc-500 font-mono">{currentStore?.store_id || 'POS'}</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 bg-zinc-950 rounded-lg border border-dashed border-zinc-800">
                  Cart is empty. Select hardware to begin.
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.serial_number}-${idx}`}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <h4 className="font-medium text-white truncate">{item.product.name}</h4>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        Serial: <span className="font-semibold text-zinc-200">{item.serial_number}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-white font-mono">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(idx)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Tax ({(taxRate * 100).toFixed(2)}% {currentStore?.city || 'Local'}):</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-zinc-800/80">
                <span>Total:</span>
                <span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-medium text-zinc-400">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {['Apple Pay', 'Apple Card Installments', 'Credit Card', 'Cash'].map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      paymentMethod === pm
                        ? 'border-white bg-white text-black font-semibold shadow-sm'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] space-y-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-300">
                <input
                  type="checkbox"
                  checked={useStoredProcedure}
                  onChange={(e) => setUseStoredProcedure(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500 bg-zinc-900 border-zinc-700"
                />
                <span>Use stored procedure (fn_process_sale)</span>
              </label>
              <p className="text-zinc-500 text-[10px] pl-5">
                Processes sale via database stored procedure fn_process_sale.
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
              className="w-full py-3.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Apple className="w-4 h-4 fill-current text-black" />
              <span>{isProcessing ? 'Processing...' : `Complete Sale • $${total.toFixed(2)}`}</span>
            </button>
          </div>
        </div>

      </div>

      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800 p-6 space-y-4 text-zinc-100">
            <h3 className="text-sm font-semibold text-white">Register New Customer</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-400 mb-1">Email / Apple ID</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.miller@icloud.com"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-400 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (212) 555-0199"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-white text-black font-semibold shadow-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {completedSale && (
        <ReceiptModal
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
        />
      )}
    </div>
  );
}

function NewAppointmentModal({ customers, geniuses, storeId = 'ST-1', onClose, onCreated }) {
  const [formData, setFormData] = useState({
    customer_id: customers[0]?.customer_id || '',
    genius_id: geniuses[0]?.employee_id || '',
    device_serial: '',
    appointment_time: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    issue_description: '',
    diagnostic_notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.genius_id || !formData.issue_description) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.createAppointment({
        store_id: String(storeId),
        customer_id: parseInt(formData.customer_id, 10),
        genius_id: parseInt(formData.genius_id, 10),
        device_serial: formData.device_serial.trim().toUpperCase() || null,
        appointment_time: new Date(formData.appointment_time).toISOString(),
        issue_description: formData.issue_description,
        diagnostic_notes: formData.diagnostic_notes || null
      });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Book Genius Bar Appointment</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Customer</label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
              >
                {customers.map((c) => (
                  <option key={c.customer_id} value={c.customer_id} className="bg-zinc-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Assigned Genius</label>
              <select
                value={formData.genius_id}
                onChange={(e) => setFormData({ ...formData, genius_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
              >
                {geniuses.map((g) => (
                  <option key={g.employee_id} value={g.employee_id} className="bg-zinc-900 text-white">
                    {g.name} ({g.badge_number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">Hardware Serial (Optional)</label>
              <input
                type="text"
                placeholder="e.g. F17LN890Q01E"
                value={formData.device_serial}
                onChange={(e) => setFormData({ ...formData, device_serial: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.appointment_time}
                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Issue Description</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Screen flickering or battery diagnostic required"
              value={formData.issue_description}
              onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1">Diagnostic Notes (Initial)</label>
            <input
              type="text"
              placeholder="e.g. User ran Apple Diagnostics (Error code: VFD001)"
              value={formData.diagnostic_notes}
              onChange={(e) => setFormData({ ...formData, diagnostic_notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GeniusBarView({ stores, selectedStoreId }) {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [geniuses, setGeniuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter, selectedStoreId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = {};
      if (statusFilter) queryParams.status = statusFilter;
      if (selectedStoreId) queryParams.store_id = selectedStoreId;

      const [appts, custs, emps] = await Promise.all([
        api.getAppointments(queryParams),
        api.getCustomers(),
        api.getEmployees({ role: 'Genius', ...(selectedStoreId ? { store_id: selectedStoreId } : {}) })
      ]);
      setAppointments(appts);
      setCustomers(custs);
      setGeniuses(emps);
    } catch (err) {
      console.error('Failed to load Genius Bar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.updateAppointment(appointmentId, { status: newStatus });
      await loadData();
    } catch (err) {
      alert(`Failed to update appointment: ${err.message}`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Scheduled
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
            In Progress
          </span>
        );
      case 'Awaiting Parts':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Awaiting Parts
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400">
            Cancelled
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-zinc-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Genius Bar Appointments</h1>
            {currentStore && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {currentStore.name} ({currentStore.store_id})
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">
            Hardware diagnostics, component repairs, and technical support schedule.
          </p>
        </div>
        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['', 'Scheduled', 'In Progress', 'Awaiting Parts', 'Completed'].map((st) => (
          <button
            key={st || 'all'}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              statusFilter === st
                ? 'bg-white text-black shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {st || 'All Appointments'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-500">Loading Genius Bar tickets...</div>
      ) : appointments.length === 0 ? (
        <div className="py-16 text-center bg-zinc-900 rounded-xl border border-zinc-800 p-8">
          <p className="text-zinc-400 text-sm">No appointments found matching this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <div
              key={appt.appointment_id}
              className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-apple-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{appt.customer_name}</h3>
                      <p className="text-[11px] text-zinc-400 font-mono">{appt.customer_email || appt.customer_phone}</p>
                    </div>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>

                <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-zinc-500">Store:</span>
                    <span className="font-medium text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      {appt.store_name} ({appt.store_id})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-zinc-500">Genius:</span>
                    <span className="font-medium text-white">{appt.genius_name} ({appt.genius_badge})</span>
                  </div>
                  {appt.device_serial && (
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-500">Device Serial:</span>
                      <span className="font-mono text-zinc-200">{appt.device_serial} {appt.device_name ? `(${appt.device_name})` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-zinc-500">Time:</span>
                    <span className="font-medium text-white">{new Date(appt.appointment_time).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs space-y-1">
                  <p className="text-zinc-200 font-medium">{appt.issue_description}</p>
                  {appt.diagnostic_notes && (
                    <p className="text-zinc-400 italic text-[11px]">
                      Diagnostics: {appt.diagnostic_notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-zinc-500 font-mono">Ticket #{appt.appointment_id}</span>
                <div className="flex items-center gap-1.5">
                  {appt.status === 'Scheduled' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.appointment_id, 'In Progress')}
                      className="px-3 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-medium border border-purple-500/20 transition-colors"
                    >
                      Begin Diagnostics
                    </button>
                  )}
                  {appt.status === 'In Progress' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(appt.appointment_id, 'Awaiting Parts')}
                        className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium border border-amber-500/20 transition-colors"
                      >
                        Order Parts
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appt.appointment_id, 'Completed')}
                        className="px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/20 transition-colors"
                      >
                        Mark Complete
                      </button>
                    </>
                  )}
                  {appt.status === 'Awaiting Parts' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.appointment_id, 'In Progress')}
                      className="px-3 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-medium border border-purple-500/20 transition-colors"
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {isBookModalOpen && (
        <NewAppointmentModal
          customers={customers}
          geniuses={geniuses}
          storeId={selectedStoreId || 'ST-1'}
          onClose={() => setIsBookModalOpen(false)}
          onCreated={() => {
            setIsBookModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

export function EmployeesView({ stores, selectedStoreId }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  
  const [formData, setFormData] = useState({
    name: '',
    role: 'Specialist',
    store_id: selectedStoreId || (stores[0]?.store_id || 'ST-1'),
    badge_number: '',
    email: ''
  });

  useEffect(() => {
    loadEmployees();
  }, [roleFilter, selectedStoreId]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (selectedStoreId) params.store_id = selectedStoreId;

      const data = await api.getEmployees(params);
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createEmployee({
        ...formData,
        store_id: String(formData.store_id)
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        role: 'Specialist',
        store_id: selectedStoreId || (stores[0]?.store_id || 'ST-1'),
        badge_number: '',
        email: ''
      });
      loadEmployees();
    } catch (err) {
      alert(`Failed to add employee: ${err.message}`);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Manager':
        return <Shield className="w-4 h-4 text-amber-400" />;
      case 'Genius':
        return <Award className="w-4 h-4 text-purple-400" />;
      default:
        return <Briefcase className="w-4 h-4 text-blue-400" />;
    }
  };

  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));

  const filteredEmployees = employees.filter(emp => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return emp.name.toLowerCase().includes(q) ||
           emp.badge_number.toLowerCase().includes(q) ||
           emp.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Store Staff Directory</h1>
            {currentStore && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-zinc-300 border border-zinc-800/60">
                {currentStore.name}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Store staff directory and team assignments.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-medium transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['', 'Manager', 'Specialist', 'Genius'].map((r) => (
            <button
              key={r || 'all'}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {r ? `${r}s` : 'All Store Staff'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name or badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500">Loading directory...</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="py-16 text-center bg-zinc-900/30 rounded-xl border border-zinc-800/60 p-8">
          <UserCheck className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-400 text-sm">No employees found at this location matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.employee_id}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-800/60 flex items-center justify-center">
                      {getRoleIcon(emp.role)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{emp.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        <span className="font-medium text-zinc-300">{emp.role}</span>
                        <span>•</span>
                        <span className="font-mono text-zinc-500">{emp.badge_number}</span>
                      </div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" title="Active Staff"></span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 space-y-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-medium text-zinc-300">{emp.store_name} ({emp.store_code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-base font-semibold text-white">New Employee</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taylor Ross"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="Specialist" className="bg-zinc-900 text-white">Specialist (Sales & POS)</option>
                    <option value="Genius" className="bg-zinc-900 text-white">Genius (Hardware & Diagnostics)</option>
                    <option value="Manager" className="bg-zinc-900 text-white">Manager (Leadership)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Store Assignment</label>
                  <select
                    value={formData.store_id}
                    onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
                  >
                    {stores.map((s) => (
                      <option key={s.store_id} value={s.store_id} className="bg-zinc-900 text-white">
                        {s.store_code} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Badge ID</label>
                  <input
                    type="text"
                    required
                    placeholder="SPC-1402"
                    value={formData.badge_number}
                    onChange={(e) => setFormData({ ...formData, badge_number: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Internal Email</label>
                  <input
                    type="email"
                    required
                    placeholder="t.ross@apple.internal"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-black font-medium shadow-sm hover:bg-zinc-200 transition-all"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar({ stores, selectedStoreId, onStoreChange, onRefresh, isRefreshing }) {
  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));

  return (
    <header className="sticky top-0 z-30 glass-nav px-6 py-3 flex items-center justify-between border-b border-zinc-800 select-none text-zinc-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white border border-zinc-800 shadow-sm">
          <Apple className="w-4 h-4 fill-current" />
        </div>
        <div>
          <span className="font-semibold text-sm tracking-tight text-white block">Apple Store</span>
          <p className="text-[11px] text-zinc-400 font-normal">Retail Operations</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="relative flex items-center bg-zinc-900 rounded-full border border-zinc-800 px-3 py-1.5 hover:border-white/20 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0" />
          <select
            value={selectedStoreId || ''}
            onChange={(e) => onStoreChange(e.target.value)}
            className="bg-transparent font-medium text-zinc-200 text-xs focus:outline-none cursor-pointer pr-4 appearance-none"
          >
            <option value="" className="bg-zinc-900 text-zinc-100">All Stores</option>
            {stores.map((st) => (
              <option key={st.store_id} value={st.store_id} className="bg-zinc-900 text-zinc-100">
                {st.name} ({st.city})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 pointer-events-none" />
        </div>

        {currentStore && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px]">
            <span>Tax: {(parseFloat(currentStore.tax_rate) * 100).toFixed(2)}%</span>
            {currentStore.flagship && <span className="text-zinc-400">• Flagship</span>}
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-zinc-200' : ''}`} />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory & Products', icon: Package },
    { id: 'pos', label: 'POS Checkout', icon: ShoppingBag },
    { id: 'genius', label: 'Genius Bar', icon: Wrench },
    { id: 'employees', label: 'Store Directory', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#09090b] border-r border-zinc-800 flex flex-col justify-between p-4 shrink-0 select-none text-zinc-100">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3">
            Menu
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 text-center">
        Apple Retail Operations
      </div>
    </aside>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(''); 
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    loadAllData();
  }, [selectedStoreId]);

  const loadStores = async () => {
    try {
      const storeData = await api.getStores();
      setStores(storeData);
    } catch (err) {
      console.error('Failed to load stores:', err);
    }
  };

  const loadAllData = async () => {
    try {
      setIsRefreshing(true);
      setGlobalError(null);
      const queryParams = selectedStoreId ? { store_id: selectedStoreId } : {};

      const [statsData, productsData, categoriesData] = await Promise.all([
        api.getDashboardStats(queryParams),
        api.getProducts(queryParams),
        api.getCategories()
      ]);
      setStats(statsData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load store data:', err);
      setGlobalError(err.message || 'Unable to communicate with the Apple Store API.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-white selection:text-black">
      <Navbar 
        stores={stores}
        selectedStoreId={selectedStoreId}
        onStoreChange={setSelectedStoreId}
        onRefresh={loadAllData} 
        isRefreshing={isRefreshing} 
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#09090b]">
          {globalError && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center justify-between">
              <span>Database Notice: {globalError}</span>
              <button
                onClick={loadAllData}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-xs text-zinc-400 font-medium tracking-wide">
                Booting Apple Store Network...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  currentStore={currentStore}
                  onNavigateToPOS={() => setActiveTab('pos')}
                  onNavigateToGenius={() => setActiveTab('genius')}
                />
              )}

              {activeTab === 'inventory' && (
                <InventoryView
                  products={products}
                  categories={categories}
                  stores={stores}
                  selectedStoreId={selectedStoreId}
                  onRefresh={loadAllData}
                />
              )}

              {activeTab === 'pos' && (
                <POSCheckoutView
                  products={products}
                  stores={stores}
                  selectedStoreId={selectedStoreId}
                  onCheckoutComplete={loadAllData}
                />
              )}

              {activeTab === 'genius' && (
                <GeniusBarView 
                  stores={stores}
                  selectedStoreId={selectedStoreId}
                />
              )}

              {activeTab === 'employees' && (
                <EmployeesView 
                  stores={stores}
                  selectedStoreId={selectedStoreId}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}