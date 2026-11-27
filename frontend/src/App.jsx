import React, { useState, useEffect } from "react";
import Apple from "lucide-react/dist/esm/icons/apple.js";
import MapPin from "lucide-react/dist/esm/icons/map-pin.js";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";
import ChevronDown from "lucide-react/dist/esm/icons/chevron-down.js";
import LayoutDashboard from "lucide-react/dist/esm/icons/layout-dashboard.js";
import Package from "lucide-react/dist/esm/icons/package.js";
import ShoppingBag from "lucide-react/dist/esm/icons/shopping-bag.js";
import Wrench from "lucide-react/dist/esm/icons/wrench.js";
import Users from "lucide-react/dist/esm/icons/users.js";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign.js";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import Building2 from "lucide-react/dist/esm/icons/building-2.js";
import Globe2 from "lucide-react/dist/esm/icons/globe-2.js";
import Search from "lucide-react/dist/esm/icons/search.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import Hash from "lucide-react/dist/esm/icons/hash.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import X from "lucide-react/dist/esm/icons/x.js";
import Trash2 from "lucide-react/dist/esm/icons/trash-2.js";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check.js";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle.js";
import Printer from "lucide-react/dist/esm/icons/printer.js";
import Calendar from "lucide-react/dist/esm/icons/calendar.js";
import Shield from "lucide-react/dist/esm/icons/shield.js";
import Award from "lucide-react/dist/esm/icons/award.js";
import Briefcase from "lucide-react/dist/esm/icons/briefcase.js";
import Mail from "lucide-react/dist/esm/icons/mail.js";
import UserCheck from "lucide-react/dist/esm/icons/user-check.js";
import ArrowLeftRight from "lucide-react/dist/esm/icons/arrow-left-right.js";
import Sparkles from "lucide-react/dist/esm/icons/sparkles.js";
import Monitor from "lucide-react/dist/esm/icons/monitor.js";
import Activity from "lucide-react/dist/esm/icons/activity.js";
import Battery from "lucide-react/dist/esm/icons/battery.js";
import Cpu from "lucide-react/dist/esm/icons/cpu.js";
import BarChart3 from "lucide-react/dist/esm/icons/bar-chart-3.js";
import Download from "lucide-react/dist/esm/icons/download.js";
import Edit3 from "lucide-react/dist/esm/icons/edit-3.js";
import Percent from "lucide-react/dist/esm/icons/percent.js";
import Tag from "lucide-react/dist/esm/icons/tag.js";
import Clock from "lucide-react/dist/esm/icons/clock.js";
import Compass from "lucide-react/dist/esm/icons/compass.js";
import Landmark from "lucide-react/dist/esm/icons/landmark.js";
import ScanLine from "lucide-react/dist/esm/icons/scan-line.js";
import QrCode from "lucide-react/dist/esm/icons/qr-code.js";
import Timer from "lucide-react/dist/esm/icons/timer.js";

import SupplyChainView from "./components/SupplyChainView.jsx";
import TodayAtAppleView from "./components/TodayAtAppleView.jsx";
import GovernanceView from "./components/GovernanceView.jsx";
import LiveQueueModal from "./components/LiveQueueModal.jsx";
import AST2DiagnosticsModal from "./components/AST2DiagnosticsModal.jsx";
import AnalyticsView from "./components/AnalyticsView.jsx";
import EditProductModal from "./components/EditProductModal.jsx";
import IssuePartModal from "./components/IssuePartModal.jsx";
import FloorplanRadarView from "./components/FloorplanRadarView.jsx";
import SpecialistWorkforceView from "./components/SpecialistWorkforceView.jsx";
import TillReconciliationModal from "./components/TillReconciliationModal.jsx";
import TradeInDiagnosticsModal from "./components/TradeInDiagnosticsModal.jsx";
import DigitalWalletPassModal from "./components/DigitalWalletPassModal.jsx";
import ManagerPINModal from "./components/ManagerPINModal.jsx";
import { api } from "./services/api.js";

export const CURRENCY_CONFIG = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)', flag: '🇺🇸', name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺', name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)', flag: '🇬🇧', name: 'British Pound' },
  CAD: { symbol: 'CA$', rate: 1.36, label: 'CAD (CA$)', flag: '🇨🇦', name: 'Canadian Dollar' },
  JPY: { symbol: '¥', rate: 154.5, label: 'JPY (¥)', flag: '🇯🇵', name: 'Japanese Yen' }
};

export function formatCurrency(amountInUSD, currencyCode = 'USD') {
  const conf = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  const converted = Number(amountInUSD || 0) * conf.rate;
  if (currencyCode === 'JPY') {
    return `${conf.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${conf.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DashboardView({
  stats,
  currentStore,
  onNavigateToPOS,
  onNavigateToGenius,
  onNavigateToTransfers,
  onNavigateToSessions,
  onNavigateToAnalytics,
  onOpenLiveQueue
}) {
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
    <div className="space-y-8 max-w-7xl mx-auto text-zinc-100 animate-fade-in-scale">
      {/* Store Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white flex items-center gap-2.5">
              <span>{currentStore ? currentStore.name : 'StoreOS Command Hub'}</span>
            </h1>
            {currentStore?.flagship && (
              <span className="badge-pill bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold shadow-[0_0_12px_rgba(251,191,36,0.2)]">
                ★ Flagship Retail Location
              </span>
            )}
            {!currentStore && (
              <span className="badge-pill bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">
                Global Operations • 75 Stores Active
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            {currentStore ? (
              <>
                {currentStore.address && <span className="text-zinc-300 font-medium">{currentStore.address}</span>}
                {currentStore.address && <span className="text-zinc-600">•</span>}
                <span>Tel: {currentStore.phone || 'N/A'}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400 font-medium">Local Sales Tax: {(parseFloat(currentStore.tax_rate) * 100).toFixed(2)}%</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{currentStore.city}, {currentStore.country}</span>
              </>
            ) : (
              <span>Enterprise telemetry & real-time retail node oversight across all 75 international locations.</span>
            )}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onNavigateToPOS}
            className="btn-apple-primary px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-black" />
            <span>New POS Sale</span>
          </button>
          <button
            onClick={onNavigateToGenius}
            className="btn-apple-secondary px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 active:scale-95"
          >
            <Wrench className="w-3.5 h-3.5 text-purple-400" />
            <span>Genius Appointment</span>
          </button>
          {onOpenLiveQueue && (
            <button
              onClick={onOpenLiveQueue}
              className="px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all active:scale-95"
            >
              <Monitor className="w-3.5 h-3.5 text-purple-400" />
              <span>Queue Display</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { label: 'POS Checkout', icon: ShoppingBag, color: 'text-blue-400', action: onNavigateToPOS },
          { label: 'Genius Bar 2.0', icon: Wrench, color: 'text-purple-400', action: onNavigateToGenius },
          { label: 'Supply Chain Hub', icon: ArrowLeftRight, color: 'text-emerald-400', action: onNavigateToTransfers },
          { label: 'Today at Apple', icon: Sparkles, color: 'text-amber-400', action: onNavigateToSessions },
          { label: 'Live Queue TV', icon: Monitor, color: 'text-indigo-400', action: onOpenLiveQueue },
          { label: 'Executive Analytics', icon: BarChart3, color: 'text-rose-400', action: onNavigateToAnalytics },
        ].map((btn, idx) => {
          const Icon = btn.icon;
          return (
            <button
              key={idx}
              onClick={btn.action}
              className="glass-card sheen-card p-3 rounded-xl flex items-center gap-2.5 hover:border-white/20 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                <Icon className={`w-3.5 h-3.5 ${btn.color}`} />
              </div>
              <span className="text-xs font-medium text-zinc-300 group-hover:text-white truncate">
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Core KPI Metrics Sheen Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sheen-card rounded-2xl p-5 glow-blue transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Available Inventory</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight">
              {metrics.inStockInventory.toLocaleString()} <span className="text-xs font-normal text-zinc-400">serialized units</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
              <span className="text-emerald-400 font-medium">{metrics.soldInventory.toLocaleString()} sold</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{metrics.reservedInventory.toLocaleString()} reserved</span>
            </div>
          </div>
        </div>

        <div className="sheen-card rounded-2xl p-5 glow-emerald transition-all">
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
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{metrics.totalSalesCount.toLocaleString()} transactions recorded</span>
            </div>
          </div>
        </div>

        <div
          onClick={onNavigateToGenius}
          className="sheen-card rounded-2xl p-5 glow-purple transition-all cursor-pointer hover:border-purple-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Genius Bar Repairs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight">
              {metrics.activeRepairs.toLocaleString()} <span className="text-xs font-normal text-zinc-400">active tickets</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>{metrics.inProgressRepairs.toLocaleString()} in diagnostics suite</span>
            </div>
          </div>
        </div>

        <div className="sheen-card rounded-2xl p-5 glow-amber transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Retail Node Network</span>
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-700/60">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-semibold text-white tracking-tight truncate">
              {currentStore ? currentStore.store_id : '75 Retail Stores'}
            </div>
            <div className="mt-1.5 text-xs text-zinc-400 truncate">
              {currentStore ? `${currentStore.city}, ${currentStore.country}` : 'Global Production Coverage'}
            </div>
          </div>
        </div>
      </div>

      {/* Global Store League Performance (When All Stores Selected) */}
      {!currentStore && storePerformance.length > 0 && (
        <div className="glass-panel sheen-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-400" />
                Store League Performance
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Global sales volume and total revenue rankings across 75 international stores.</p>
            </div>
            <span className="badge-pill bg-white/5 text-zinc-400 border border-white/10 font-mono">
              75 Retail Nodes
            </span>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-[#121216] z-10">
                <tr className="border-b border-white/[0.08] text-zinc-400 font-medium">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Store Name</th>
                  <th className="py-2.5 px-3">Store ID</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Tax Rate</th>
                  <th className="py-2.5 px-3 text-right">In-Stock Units</th>
                  <th className="py-2.5 px-3 text-right">Transactions</th>
                  <th className="py-2.5 px-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {storePerformance.map((st, idx) => {
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
                  return (
                    <tr key={st.store_id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-zinc-300">
                        {medal ? (
                          <span className="text-sm mr-1">{medal} #{idx + 1}</span>
                        ) : (
                          <span className="text-zinc-500 font-mono">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-zinc-100 flex items-center gap-1.5">
                        <span>{st.store_name}</span>
                        {st.flagship && <span className="text-amber-400 text-xs" title="Flagship Location">★</span>}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">{st.store_id}</td>
                      <td className="py-2.5 px-3 text-zinc-400">{st.city}, {st.country}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">{(parseFloat(st.tax_rate) * 100).toFixed(2)}%</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-medium">
                        {Number(st.in_stock_units).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-300">
                        {Number(st.total_sales_count).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-white">
                        ${Number(st.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Breakdown & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel sheen-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Inventory by Category</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {currentStore ? `Serialized hardware stock localized at ${currentStore.name}` : 'Stock distribution and inventory valuation across product lines.'}
              </p>
            </div>
            <span className="badge-pill bg-white/5 text-zinc-400 border border-white/10 font-medium">
              {categoryBreakdown.length} Product Lines
            </span>
          </div>

          <div className="space-y-3.5">
            {categoryBreakdown.map((cat) => {
              const inStock = parseInt(cat.in_stock_units, 10) || 0;
              const total = parseInt(cat.total_units, 10) || 1;
              const percent = Math.min(100, Math.round((inStock / (total || 1)) * 100));

              // Category gradient styling
              const gradient =
                cat.category_name.includes('iPhone') ? 'from-blue-500 to-indigo-500' :
                cat.category_name.includes('Mac') ? 'from-sky-400 to-cyan-500' :
                cat.category_name.includes('iPad') ? 'from-purple-500 to-violet-500' :
                cat.category_name.includes('Watch') ? 'from-amber-400 to-orange-500' :
                cat.category_name.includes('AirPods') ? 'from-emerald-400 to-teal-500' :
                'from-rose-400 to-pink-500';

              return (
                <div key={cat.category_id} className="p-3.5 rounded-xl bg-zinc-950/70 hover:bg-zinc-950 transition-colors border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-zinc-200 text-sm">{cat.category_name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-400 font-medium">{inStock.toLocaleString()} in stock / {total.toLocaleString()} units</span>
                      <span className="font-semibold text-white font-mono">
                        ${Number(cat.stock_value || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-700/30">
                    <div
                      className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${gradient}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel sheen-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Retail Activity
              </h2>
              <span className="badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Feed
              </span>
            </div>

            <div className="mt-4 space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
              {activityFeed.length === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center">No recent activity recorded.</p>
              ) : (
                activityFeed.map((item, idx) => {
                  const isSale = item.type === 'sale';
                  return (
                    <div key={`${item.id}-${idx}`} className="flex items-start gap-3 text-xs p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                      <div className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSale ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {isSale ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-200 truncate">{item.customer_name}</span>
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

          <div className="pt-4 border-t border-white/[0.08] text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-time ACID replication active</span>
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
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80';
                }}
                className="w-14 h-14 rounded-lg object-contain p-1 bg-zinc-950 border border-zinc-800"
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
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [selectedProductForSerials, setSelectedProductForSerials] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !selectedCategory || String(p.category_id) === String(selectedCategory);
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.specs && JSON.stringify(p.specs).toLowerCase().includes(search.toLowerCase()));

    const inStock = parseInt(p.in_stock_count, 10) || 0;
    let matchesStock = true;
    if (stockFilter === 'in_stock') matchesStock = inStock > 0;
    else if (stockFilter === 'low_stock') matchesStock = inStock > 0 && inStock <= 2;
    else if (stockFilter === 'out_of_stock') matchesStock = inStock === 0;

    return matchesCategory && matchesSearch && matchesStock;
  });

  const handleExportInventoryCSV = () => {
    const headers = ['Product ID', 'Product Name', 'Category', 'Base Price ($)', 'In Stock Units', 'Total Serialized Units', 'Stock Valuation ($)'];
    const rows = filteredProducts.map(p => [
      p.product_id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category_name || ''}"`,
      Number(p.base_price).toFixed(2),
      p.in_stock_count || 0,
      p.total_units || 0,
      Number(p.in_stock_valuation || 0).toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apple_store_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportInventoryCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="glass-panel sheen-card p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${selectedCategory === null
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
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${String(selectedCategory) === String(cat.category_id)
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

        {/* Stock Level Filter */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pt-2.5 border-t border-zinc-800/60">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All Stock Levels' },
            { id: 'in_stock', label: 'In Stock (>0)' },
            { id: 'low_stock', label: '⚠️ Low Stock (≤2)' },
            { id: 'out_of_stock', label: 'Out of Stock' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStockFilter(s.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                stockFilter === s.id
                  ? 'bg-zinc-700 text-white font-semibold shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const inStock = parseInt(product.in_stock_count, 10) || 0;
          const totalUnits = parseInt(product.total_units, 10) || 0;

          return (
            <div
              key={product.product_id}
              className="group glass-card sheen-card rounded-2xl hover:border-white/25 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="aspect-[4/3] rounded-lg bg-zinc-950 overflow-hidden relative mb-4 border border-zinc-800/80 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
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
                      inStock > 2 ? 'text-emerald-400' : inStock > 0 ? 'text-amber-400' : 'text-zinc-500'
                    }`}>
                      {inStock} Units {inStock <= 2 && inStock > 0 && '(Low)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedProductForSerials(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium transition-colors"
                  >
                    <Hash className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Serials ({totalUnits})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 ml-auto" />
                  </button>
                  <button
                    onClick={() => setEditingProduct(product)}
                    title="Edit Product Specification"
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
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

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onUpdated={() => {
            setEditingProduct(null);
            onRefresh();
          }}
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

function ReceiptModal({ sale, onClose, onOpenWalletPass }) {
  const [emailStatus, setEmailStatus] = useState(null);

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    setEmailStatus('Receipt emailed to ' + (sale.customer_email || 'registered customer'));
    setTimeout(() => setEmailStatus(null), 4000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sale, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Apple_Receipt_${sale.receipt_number}.json`);
    dlAnchorElem.click();
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

        {emailStatus && (
          <div className="bg-emerald-500/20 text-emerald-300 text-xs py-2 px-4 text-center font-medium border-b border-emerald-500/30">
            {emailStatus}
          </div>
        )}

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

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 flex gap-2 justify-end flex-wrap">
          <button
            onClick={handleEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-800 text-zinc-200 text-xs font-medium hover:bg-zinc-750"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => onOpenWalletPass && onOpenWalletPass(sale)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold shadow-sm transition-colors"
          >
            <Apple className="w-3.5 h-3.5 fill-current" />
            <span>Apple Wallet (.pkpass)</span>
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

  // Quick Serial Barcode Scan
  const [quickSerial, setQuickSerial] = useState('');
  const [quickScanError, setQuickScanError] = useState(null);

  // Product Filter & Search
  const [posCategory, setPosCategory] = useState('All');
  const [posSearch, setPosSearch] = useState('');

  // Discount Pricing Tiers (EPP / Education)
  const [discountTier, setDiscountTier] = useState('none');

  const [appleCarePlan, setAppleCarePlan] = useState('None');
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [tradeInModel, setTradeInModel] = useState('');
  const [tradeInCondition, setTradeInCondition] = useState('Good');
  const [tradeInCredit, setTradeInCredit] = useState(0);
  const selectedProduct = products.find(p => String(p.product_id) === String(selectedProductId));
  const [isCalculatingQuote, setIsCalculatingQuote] = useState(false);

  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [completedSale, setCompletedSale] = useState(null);
  const [isTradeInDiagModalOpen, setIsTradeInDiagModalOpen] = useState(false);
  const [walletPassSale, setWalletPassSale] = useState(null);

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

  const handleQuickScan = async (e) => {
    e.preventDefault();
    if (!quickSerial.trim()) return;
    try {
      setQuickScanError(null);
      const item = await api.getInventoryBySerial(quickSerial.trim());
      if (item.status !== 'In Stock') {
        throw new Error(`Unit ${item.serial_number} is currently marked '${item.status}'. Only 'In Stock' units can be sold.`);
      }
      if (cart.some(c => c.serial_number === item.serial_number)) {
        throw new Error(`Serial ${item.serial_number} is already in the cart.`);
      }
      setCart(prev => [
        ...prev,
        {
          product: {
            product_id: item.product_id,
            name: item.product_name,
            base_price: item.base_price,
            category_name: item.category_name,
            image_url: item.image_url
          },
          serial_number: item.serial_number,
          price: parseFloat(item.base_price)
        }
      ]);
      setQuickSerial('');
    } catch (err) {
      setQuickScanError(err.message || 'Serial quick scan failed.');
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

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountRate = discountTier === 'epp_15' ? 0.15 : discountTier === 'edu_10' ? 0.10 : 0;
  const discountAmount = Math.round(rawSubtotal * discountRate * 100) / 100;
  const appleCareCost = cart.length > 0 ? (appleCarePlan === 'AppleCare+' ? 199 : appleCarePlan === 'AppleCare+ Theft & Loss' ? 269 : 0) : 0;
  const subtotal = Math.max(0, rawSubtotal - discountAmount) + appleCareCost;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.max(0, Math.round((subtotal + tax - tradeInCredit) * 100) / 100);

  const posCategories = ['All', ...Array.from(new Set(products.map(p => p.category_name).filter(Boolean)))];
  const filteredPOSProducts = products.filter(p => {
    const matchesCat = posCategory === 'All' || p.category_name === posCategory;
    const matchesSearch = !posSearch.trim() || p.name.toLowerCase().includes(posSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCalculateTradeIn = async () => {
    if (!tradeInModel) return;
    try {
      setIsCalculatingQuote(true);
      const res = await api.getTradeInQuote({
        model: tradeInModel,
        condition_grade: tradeInCondition
      });
      setTradeInCredit(res.assessed_credit || 0);
    } catch (err) {
      alert(`Trade-in quote error: ${err.message}`);
    } finally {
      setIsCalculatingQuote(false);
    }
  };

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
        use_stored_proc: useStoredProcedure,
        applecare_plan_type: appleCarePlan,
        trade_in_credit: tradeInCredit,
        trade_in_model: tradeInModel
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

          <div className="glass-panel sheen-card p-6 rounded-2xl space-y-4">
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

          {/* Direct Barcode / RFID Serial Quick-Scanner */}
          <div className="glass-panel sheen-card p-5 rounded-2xl glow-blue space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-white flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-blue-400" />
                Direct Serial / Barcode Quick-Scan
              </h2>
              <span className="text-[10px] text-zinc-500 font-mono">Instant Inventory Verification</span>
            </div>
            <form onSubmit={handleQuickScan} className="flex gap-2">
              <input
                type="text"
                placeholder="Scan or enter hardware serial (e.g. F17ST1P32Q0001)..."
                value={quickSerial}
                onChange={(e) => setQuickSerial(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/[0.08] text-white placeholder-zinc-500 font-mono text-xs focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
              <button
                type="submit"
                disabled={!quickSerial.trim()}
                className="btn-apple-primary px-4 py-2.5 rounded-xl text-black text-xs font-semibold disabled:opacity-40 transition-colors shrink-0 shadow-sm"
              >
                Scan & Add
              </button>
            </form>
            {quickScanError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1.5 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{quickScanError}</span>
              </p>
            )}
          </div>

          <div className="glass-panel sheen-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Select from Product Catalog</h2>
                <p className="text-xs text-zinc-400">
                  Available in stock at <span className="font-medium text-white">{currentStore?.name}</span>.
                </p>
              </div>
              <span className="text-xs text-zinc-400 font-mono">{filteredPOSProducts.length} items</span>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {posCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPosCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
                      posCategory === cat
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter product model name..."
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-400 mb-1.5">Select Device Model</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-medium focus:outline-none focus:border-white/30"
                >
                  <option value="" className="bg-zinc-900">-- Select a Product ({filteredPOSProducts.length} available) --</option>
                  {filteredPOSProducts.map((p) => (
                    <option key={p.product_id} value={p.product_id} className="bg-zinc-900">
                      {p.name} — ${Number(p.base_price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductId && selectedProduct && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                  <div className="flex items-center gap-3.5 pb-3 border-b border-zinc-800/60">
                    {selectedProduct.image_url && (
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-14 h-14 rounded-xl object-contain p-1.5 bg-zinc-900 border border-white/10 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                          {selectedProduct.category_name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">#{selectedProduct.product_id}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate mt-1">{selectedProduct.name}</h4>
                      <p className="text-[11px] font-mono text-emerald-400 font-medium">
                        ${Number(selectedProduct.base_price).toLocaleString()} MSRP
                      </p>
                    </div>
                  </div>

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
          <div className="glass-panel sheen-card p-6 rounded-2xl space-y-5 glow-emerald">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
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
                    className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/60 flex items-center justify-between gap-3 text-xs hover:border-zinc-700/80 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-contain p-1 bg-zinc-900 border border-white/5 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <h4 className="font-medium text-white truncate">{item.product.name}</h4>
                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          Serial: <span className="font-semibold text-zinc-200">{item.serial_number}</span>
                        </div>
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

            {/* AppleCare+ Plan Picker */}
            <div className="space-y-2 text-xs pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> AppleCare+ Coverage
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Hardware Protection</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                {[
                  { id: 'None', label: '1-Yr Standard', price: 0 },
                  { id: 'AppleCare+', label: 'AppleCare+ (2 Yr)', price: 199 },
                  { id: 'AppleCare+ Theft & Loss', label: 'Theft & Loss', price: 269 }
                ].map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setAppleCarePlan(plan.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      appleCarePlan === plan.id
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300 font-semibold shadow-sm'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="block font-medium truncate">{plan.label}</span>
                    <span className="font-mono text-zinc-500">{plan.price > 0 ? `+$${plan.price}` : 'Included'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Apple Trade-In Credit Engine */}
            <div className="space-y-2 text-xs pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Apple Trade-In
                </span>
                {tradeInCredit > 0 ? (
                  <span className="text-emerald-400 font-mono font-bold">-${tradeInCredit.toFixed(2)} Applied</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsTradeInOpen(!isTradeInOpen)}
                    className="text-blue-400 hover:text-blue-300 text-[11px] font-medium"
                  >
                    {isTradeInOpen ? 'Close' : '+ Add Trade-In'}
                  </button>
                )}
              </div>

              {isTradeInOpen && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => setIsTradeInDiagModalOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all shadow-sm"
                  >
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>Run Trade-In Diagnostics (Battery, iCloud, Screen)</span>
                  </button>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Customer Older Device Model</label>
                    <input
                      type="text"
                      value={tradeInModel}
                      onChange={(e) => setTradeInModel(e.target.value)}
                      placeholder="e.g. iPhone 14 Pro 128GB Space Black"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Condition Grade</label>
                    <select
                      value={tradeInCondition}
                      onChange={(e) => setTradeInCondition(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                    >
                      <option value="Mint">Mint (Flawless screen & enclosure)</option>
                      <option value="Good">Good (Minor normal scratches)</option>
                      <option value="Cracked Screen">Cracked Screen / Enclosure Dents</option>
                      <option value="Non-Functional">Non-Functional / Recycling</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <button
                      type="button"
                      onClick={handleCalculateTradeIn}
                      disabled={!tradeInModel || isCalculatingQuote}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                    >
                      {isCalculatingQuote ? 'Valuating...' : 'Calculate & Apply Credit'}
                    </button>
                    {tradeInCredit > 0 && (
                      <button
                        type="button"
                        onClick={() => { setTradeInCredit(0); setTradeInModel(''); }}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Preferred Pricing / Tier Discounts */}
            <div className="space-y-2 text-xs pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-400" /> Preferred Pricing
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Tier Discounts</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                {[
                  { id: 'none', label: 'Standard MSRP', rate: '0%' },
                  { id: 'edu_10', label: 'Education Store', rate: '-10%' },
                  { id: 'epp_15', label: 'Apple EPP / Staff', rate: '-15%' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setDiscountTier(tier.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      discountTier === tier.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold shadow-sm'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="block font-medium truncate">{tier.label}</span>
                    <span className="font-mono text-zinc-500">{tier.rate}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Cart Subtotal:</span>
                <span className="font-mono text-white">${rawSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>{discountTier === 'epp_15' ? 'Apple EPP Discount (-15%):' : 'Higher Education Discount (-10%):'}</span>
                  <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {appleCareCost > 0 && (
                <div className="flex justify-between text-blue-400">
                  <span>AppleCare+ Plan:</span>
                  <span className="font-mono font-medium">+${appleCareCost.toFixed(2)}</span>
                </div>
              )}
              {tradeInCredit > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Apple Trade-In Credit:</span>
                  <span className="font-mono font-bold">-${tradeInCredit.toFixed(2)}</span>
                </div>
              )}
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
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${paymentMethod === pm
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
          onOpenWalletPass={(sale) => setWalletPassSale(sale)}
        />
      )}

      {/* Trade-In Hardware Diagnostics Modal */}
      {isTradeInDiagModalOpen && (
        <TradeInDiagnosticsModal
          isOpen={isTradeInDiagModalOpen}
          onClose={() => setIsTradeInDiagModalOpen(false)}
          onApplyCredit={(data) => {
            setTradeInModel(data.device_model || 'Diagnosed Apple Device');
            setTradeInCredit(data.credit_value || 0);
            setTradeInCondition(data.cosmetic_grade || 'Good');
            setIsTradeInDiagModalOpen(false);
            setIsTradeInOpen(true);
          }}
        />
      )}

      {/* Digital Apple Wallet Pass (.pkpass) Modal */}
      {walletPassSale && (
        <DigitalWalletPassModal
          isOpen={!!walletPassSale}
          onClose={() => setWalletPassSale(null)}
          passData={walletPassSale}
          saleId={walletPassSale?.sale_id}
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

export function GeniusBarView({ stores, selectedStoreId, onOpenLiveQueue }) {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [geniuses, setGeniuses] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [geniusSubTab, setGeniusSubTab] = useState('tickets'); // 'tickets' | 'parts'

  // Issue Part Modal
  const [isIssuePartModalOpen, setIsIssuePartModalOpen] = useState(false);
  const [selectedAppointmentForPart, setSelectedAppointmentForPart] = useState(null);

  // AST 2 Diagnostics
  const [isASTModalOpen, setIsASTModalOpen] = useState(false);
  const [selectedSerialForAST, setSelectedSerialForAST] = useState('');
  const [selectedModelForAST, setSelectedModelForAST] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter, selectedStoreId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = {};
      if (statusFilter) queryParams.status = statusFilter;
      if (selectedStoreId) queryParams.store_id = selectedStoreId;

      const [appts, custs, emps, partsData] = await Promise.all([
        api.getAppointments(queryParams),
        api.getCustomers(),
        api.getEmployees({ role: 'Genius', ...(selectedStoreId ? { store_id: selectedStoreId } : {}) }),
        api.getGeniusParts(selectedStoreId ? { store_id: selectedStoreId } : {})
      ]);
      setAppointments(appts);
      setCustomers(custs);
      setGeniuses(emps);
      setParts(partsData);
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
            <h1 className="text-2xl font-semibold tracking-tight text-white">Genius Bar Operations</h1>
            {currentStore && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {currentStore.name} ({currentStore.store_id})
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">
            Hardware diagnostics, component repairs, live in-store queue, and spare parts BOM inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenLiveQueue && (
            <button
              onClick={onOpenLiveQueue}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold shadow-sm transition-all"
            >
              <Monitor className="w-4 h-4 text-purple-400" />
              <span>Live Queue Display</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedSerialForAST('');
              setSelectedModelForAST('iPhone 16 Pro');
              setIsASTModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold shadow-sm transition-all"
          >
            <Activity className="w-4 h-4 text-blue-400" />
            <span>AST 2 Benchmarks</span>
          </button>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book Ticket</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Tickets vs Spare Parts */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
        <button
          onClick={() => setGeniusSubTab('tickets')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            geniusSubTab === 'tickets'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Diagnostic Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setGeniusSubTab('parts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            geniusSubTab === 'parts'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Spare Parts Inventory BOM ({parts.length})
        </button>
      </div>

      {geniusSubTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['', 'Scheduled', 'In Progress', 'Awaiting Parts', 'Completed'].map((st) => (
              <button
                key={st || 'all'}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${statusFilter === st
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
                  className="glass-card sheen-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-500/30 transition-all"
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

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs flex-wrap">
                    <span className="text-[11px] text-zinc-500 font-mono">Ticket #{appt.appointment_id}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {appt.device_serial && (
                        <button
                          onClick={() => {
                            setSelectedSerialForAST(appt.device_serial);
                            setSelectedModelForAST(appt.device_name || 'iPhone 16 Pro');
                            setIsASTModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium text-[11px] border border-blue-500/20 transition-colors flex items-center gap-1"
                        >
                          <Activity className="w-3 h-3" />
                          <span>AST 2 Test</span>
                        </button>
                      )}

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
                            onClick={() => {
                              setSelectedAppointmentForPart(appt);
                              setIsIssuePartModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-medium text-[11px] border border-purple-500/20 transition-colors flex items-center gap-1"
                          >
                            <Wrench className="w-3 h-3 text-purple-400" />
                            <span>Issue Part</span>
                          </button>
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
        </div>
      )}

      {/* Spare Parts Inventory BOM Tab */}
      {geniusSubTab === 'parts' && (
        <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Genius Bar Replacement Hardware BOM</h3>
              <p className="text-xs text-zinc-400">Official OEM component sub-assemblies stocked for bench technicians.</p>
            </div>
            <span className="text-xs font-mono text-zinc-500">{parts.length} Part SKUs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Part Number</th>
                  <th className="py-2.5 px-3">Component Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Compatible Family</th>
                  <th className="py-2.5 px-3">Unit Cost</th>
                  <th className="py-2.5 px-3">Available Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {parts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500">
                      No repair parts currently cataloged for this store location.
                    </td>
                  </tr>
                ) : (
                  parts.map((p) => (
                    <tr key={p.part_id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-blue-400 font-semibold">{p.part_number}</td>
                      <td className="py-3 px-3 font-medium text-white">{p.name}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{p.compatible_product_name || p.compatible_product_id || 'Universal'}</td>
                      <td className="py-3 px-3 font-mono text-zinc-200">${Number(p.unit_cost).toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`font-mono font-bold ${p.stock_quantity <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {p.stock_quantity} units
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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

      {isIssuePartModalOpen && (
        <IssuePartModal
          appointment={selectedAppointmentForPart}
          parts={parts}
          onClose={() => {
            setIsIssuePartModalOpen(false);
            setSelectedAppointmentForPart(null);
          }}
          onIssued={() => {
            setIsIssuePartModalOpen(false);
            setSelectedAppointmentForPart(null);
            loadData();
          }}
        />
      )}

      {isASTModalOpen && (
        <AST2DiagnosticsModal
          serialNumber={selectedSerialForAST}
          deviceModel={selectedModelForAST}
          onClose={() => setIsASTModalOpen(false)}
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
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${roleFilter === r
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
              className="glass-card sheen-card p-5 rounded-2xl hover:border-white/20 transition-all flex flex-col justify-between"
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

function Navbar({ stores, selectedStoreId, onStoreChange, onRefresh, isRefreshing, currentRole, onRoleChange, onOpenLiveQueue, selectedCurrency, onCurrencyChange, onOpenTillReconcile }) {
  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleDot = (role) => {
    switch (role) {
      case 'Manager': return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
      case 'Genius': return 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]';
      case 'Inventory': return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
      default: return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]';
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-nav px-5 py-2.5 flex items-center justify-between border-b border-white/[0.08] select-none text-zinc-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black shadow-md border border-white/20">
          <Apple className="w-4 h-4 fill-current text-black" />
        </div>
        <div>
          <span className="font-semibold text-sm tracking-tight text-white block leading-none">Apple StoreOS</span>
          <p className="text-[10px] text-zinc-400 font-normal mt-0.5">Global Retail Infrastructure</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 text-xs">
        {/* Live Queue Board Trigger */}
        <button
          onClick={onOpenLiveQueue}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium transition-all shadow-[0_0_12px_rgba(192,132,252,0.15)] active:scale-95"
        >
          <Monitor className="w-3.5 h-3.5 text-purple-400" />
          <span>Queue Board</span>
        </button>

        {/* End of Day Till Reconciliation */}
        <button
          onClick={onOpenTillReconcile}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all shadow-sm active:scale-95"
          title="Till Balancing & Midday Vault Drops"
        >
          <Landmark className="w-3.5 h-3.5 text-emerald-400" />
          <span>Till & Vault</span>
        </button>

        {/* Regional Multi-Currency Engine */}
        <div className="flex items-center bg-zinc-950/80 rounded-full border border-white/[0.08] px-2.5 py-1.5 hover:border-white/20 transition-colors">
          <Globe2 className="w-3.5 h-3.5 text-zinc-400 mr-1.5 shrink-0" />
          <select
            value={selectedCurrency || 'USD'}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="bg-transparent font-medium text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1 appearance-none"
            title="Multi-Currency Engine"
          >
            {Object.entries(CURRENCY_CONFIG).map(([code, cfg]) => (
              <option key={code} value={code} className="bg-zinc-900 text-zinc-100">
                {cfg.flag} {code} ({cfg.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Hardware Barcode Scanner Status */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono">
          <ScanLine className="w-3 h-3 text-blue-400 animate-pulse" />
          <span>Scanner Ready</span>
        </div>

        {/* RBAC Role Switcher */}
        <div className="flex items-center bg-zinc-950/80 rounded-full border border-white/[0.08] px-3 py-1.5 hover:border-white/20 transition-colors">
          <span className={`w-2 h-2 rounded-full mr-2 shrink-0 ${getRoleDot(currentRole)}`}></span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-transparent font-medium text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1 appearance-none"
          >
            <option value="Specialist" className="bg-zinc-900">Role: Specialist</option>
            <option value="Genius" className="bg-zinc-900">Role: Genius</option>
            <option value="Inventory" className="bg-zinc-900">Role: Inventory</option>
            <option value="Manager" className="bg-zinc-900">Role: Manager</option>
          </select>
        </div>

        {/* Store Selector */}
        <div className="relative flex items-center bg-zinc-950/80 rounded-full border border-white/[0.08] px-3 py-1.5 hover:border-white/20 transition-colors">
          <MapPin className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0" />
          <select
            value={selectedStoreId || ''}
            onChange={(e) => onStoreChange(e.target.value)}
            className="bg-transparent font-medium text-zinc-200 text-xs focus:outline-none cursor-pointer pr-4 appearance-none"
          >
            <option value="" className="bg-zinc-900 text-zinc-100">All 75 Stores</option>
            {stores.map((st) => (
              <option key={st.store_id} value={st.store_id} className="bg-zinc-900 text-zinc-100">
                {st.name} ({st.city})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 pointer-events-none" />
        </div>

        {/* Store Address & Tax Detail Pill */}
        {currentStore && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/80 text-zinc-300 border border-white/[0.08] text-[11px]">
            {currentStore.address && <span className="text-zinc-400 truncate max-w-xs">{currentStore.address} •</span>}
            <span className="font-mono text-emerald-400">Tax: {(parseFloat(currentStore.tax_rate) * 100).toFixed(2)}%</span>
            {currentStore.flagship && <span className="text-amber-400 font-medium">• Flagship ★</span>}
          </div>
        )}

        {/* PostgreSQL 17 Live Heartbeat */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono shadow-[0_0_10px_rgba(52,211,153,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>PostgreSQL 17 Live</span>
        </div>

        {/* Live Network Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.08] text-[10px] font-mono">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span>{timeStr || '00:00:00'}</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Sync Apple Store Network"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-zinc-200' : ''}`} />
        </button>
      </div>
    </header>
  );
}

function Sidebar({ activeTab, setActiveTab, currentStore, currentRole }) {
  const navGroups = [
    {
      group: 'Retail Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'floorplan', label: 'Floorplan Radar', icon: Compass, badge: 'Live Radar' },
        { id: 'inventory', label: 'Inventory & Serials', icon: Package },
        { id: 'pos', label: 'POS Checkout', icon: ShoppingBag, badge: 'Active' },
      ]
    },
    {
      group: 'Support & Repair',
      items: [
        { id: 'genius', label: 'Genius Bar 2.0', icon: Wrench },
        { id: 'sessions', label: 'Today at Apple', icon: Sparkles },
      ]
    },
    {
      group: 'Enterprise & Supply',
      items: [
        { id: 'transfers', label: 'Supply Chain Hub', icon: ArrowLeftRight },
        { id: 'governance', label: 'Governance & Audits', icon: ShieldCheck },
      ]
    },
    {
      group: 'Workforce & Insights',
      items: [
        { id: 'workforce', label: 'Specialist Operations', icon: Timer, badge: 'Roster' },
        { id: 'employees', label: 'Store Directory', icon: Users },
        { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0a0d] border-r border-white/[0.08] flex flex-col justify-between p-3.5 shrink-0 select-none text-zinc-100">
      <div className="space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase px-3">
              {group.group}
            </span>
            <nav className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'btn-apple-primary shadow-sm font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Operator Session Info Card */}
      <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/[0.06] space-y-2 text-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10">
              <Apple className="w-3 h-3 fill-current" />
            </div>
            <div>
              <div className="font-semibold text-white leading-tight">StoreOS 18.2</div>
              <div className="text-[10px] text-zinc-400">{currentRole || 'Manager'} Session</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" title="System Online"></span>
        </div>
        <div className="pt-2 border-t border-white/[0.06] text-[10px] text-zinc-400 flex items-center justify-between">
          <span className="truncate max-w-[140px]">{currentStore ? currentStore.name : '75 Retail Nodes'}</span>
          <span className="font-mono text-zinc-500 shrink-0">ACID 100%</span>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('Manager');
  const [isLiveQueueOpen, setIsLiveQueueOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isTillReconcileOpen, setIsTillReconcileOpen] = useState(false);
  const [scannedAlert, setScannedAlert] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // Global Hardware Barcode / RFID Scanner Listener
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 150) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length >= 4) {
          const barcode = buffer.trim();
          handleScannedBarcode(barcode);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    const handleScannedBarcode = (barcode) => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (err) {}

      const matchedProd = products.find(p => p.sku === barcode || (p.name && p.name.toLowerCase().includes(barcode.toLowerCase())));
      setScannedAlert({
        code: barcode,
        product: matchedProd || null,
        timestamp: new Date().toLocaleTimeString()
      });
      setTimeout(() => setScannedAlert(null), 5000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products]);

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
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenLiveQueue={() => setIsLiveQueueOpen(true)}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        onOpenTillReconcile={() => setIsTillReconcileOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentStore={currentStore}
          currentRole={currentRole}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#09090b]">
          {globalError && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center justify-between">
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
                  onNavigateToTransfers={() => setActiveTab('transfers')}
                  onNavigateToSessions={() => setActiveTab('sessions')}
                  onNavigateToAnalytics={() => setActiveTab('analytics')}
                  onOpenLiveQueue={() => setIsLiveQueueOpen(true)}
                />
              )}

              {activeTab === 'floorplan' && (
                <FloorplanRadarView
                  stores={stores}
                  selectedStoreId={selectedStoreId}
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
                  onOpenLiveQueue={() => setIsLiveQueueOpen(true)}
                />
              )}

              {activeTab === 'transfers' && (
                <SupplyChainView
                  stores={stores}
                  selectedStoreId={selectedStoreId}
                  products={products}
                  onRefresh={loadAllData}
                />
              )}

              {activeTab === 'sessions' && (
                <TodayAtAppleView
                  stores={stores}
                  selectedStoreId={selectedStoreId}
                />
              )}

              {activeTab === 'governance' && (
                <GovernanceView
                  selectedStoreId={selectedStoreId}
                  currentRole={currentRole}
                  onRoleChange={setCurrentRole}
                />
              )}

              {activeTab === 'workforce' && (
                <SpecialistWorkforceView
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

              {activeTab === 'analytics' && (
                <AnalyticsView
                  stores={stores}
                  selectedStoreId={selectedStoreId}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Genius Live Queue Board Fullscreen Mode */}
      {isLiveQueueOpen && (
        <LiveQueueModal
          storeId={selectedStoreId || 'ST-1'}
          storeName={currentStore?.name || currentStore?.store_name || 'Apple Retail Flagship'}
          onClose={() => setIsLiveQueueOpen(false)}
        />
      )}

      {/* Till Reconciliation & Midday Vault Drops Modal */}
      {isTillReconcileOpen && (
        <TillReconciliationModal
          isOpen={isTillReconcileOpen}
          onClose={() => setIsTillReconcileOpen(false)}
          storeId={selectedStoreId || 'ST-1'}
          registerId="REG-01"
        />
      )}

      {/* Global Hardware Barcode / RFID Scanner Alert Toast */}
      {scannedAlert && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-900/95 border border-blue-500/40 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-slide-up">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <ScanLine className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-white">Hardware Barcode Verified</span>
              <span className="text-[10px] font-mono text-zinc-400">{scannedAlert.timestamp}</span>
            </div>
            <p className="text-xs font-mono text-blue-300 font-bold">{scannedAlert.code}</p>
            {scannedAlert.product && (
              <p className="text-[11px] text-zinc-400">{scannedAlert.product.name} • ${scannedAlert.product.retail_price}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}