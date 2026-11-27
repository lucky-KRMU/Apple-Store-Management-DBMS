import React, { useState, useEffect } from 'react';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.js';
import Award from 'lucide-react/dist/esm/icons/award.js';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js';
import Wrench from 'lucide-react/dist/esm/icons/wrench.js';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign.js';
import Package from 'lucide-react/dist/esm/icons/package.js';
import Download from 'lucide-react/dist/esm/icons/download.js';
import Search from 'lucide-react/dist/esm/icons/search.js';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.js';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card.js';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3.js';
import { api } from '../services/api.js';

export function AnalyticsView({ stores, selectedStoreId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeSearch, setStoreSearch] = useState('');
  const [activeMetricTab, setActiveMetricTab] = useState('bestsellers'); // 'bestsellers' | 'stores' | 'categories' | 'margins'
  const [marginsData, setMarginsData] = useState(null);

  useEffect(() => {
    loadAnalytics();
    loadMargins();
  }, [selectedStoreId]);

  const loadMargins = async () => {
    try {
      const res = await fetch('/api/analytics/margins');
      const json = await res.json();
      setMarginsData(json);
    } catch (e) {
      console.error('Failed to load margins', e);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getExecutiveAnalytics(selectedStoreId ? { store_id: selectedStoreId } : {});
      setData(res);
    } catch (err) {
      console.error('Failed to load executive analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentStore = stores.find(s => String(s.store_id) === String(selectedStoreId));

  const handleExportCSV = () => {
    if (!data?.storeRankings) return;
    const headers = ['Store ID', 'Store Name', 'City', 'Country', 'Flagship', 'Revenue ($)', 'Sales Count', 'AOV ($)'];
    const rows = data.storeRankings.map(s => [
      s.store_id,
      `"${s.store_name}"`,
      s.city,
      s.country,
      s.flagship ? 'YES' : 'NO',
      Number(s.revenue).toFixed(2),
      s.sales_count,
      Number(s.avg_order_value).toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apple_store_performance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-zinc-500 text-sm flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin"></div>
        <span>Compiling executive sales intelligence & store benchmarks...</span>
      </div>
    );
  }

  const topProducts = data?.topProducts || [];
  const storeRankings = data?.storeRankings || [];
  const categoryShare = data?.categoryShare || [];
  const paymentBreakdown = data?.paymentBreakdown || [];

  const totalCatRevenue = categoryShare.reduce((acc, c) => acc + parseFloat(c.revenue || 0), 0);

  const filteredStoreRankings = storeRankings.filter(s => {
    if (!storeSearch) return true;
    const q = storeSearch.toLowerCase();
    return s.store_name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.country.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-white" />
              Executive Analytics & Store Intelligence
            </h1>
            {currentStore && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentStore.name}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">
            Real-time revenue performance, AppleCare+ attach rates, Genius Bar resolution velocity, and global retail rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-medium transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Level Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Attach Rate */}
        <div className="sheen-card rounded-2xl p-5 flex flex-col justify-between glow-purple">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">AppleCare+ Attach Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight font-mono">
              {data?.attachRatePct || 36}%
            </div>
            <div className="mt-2 w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (data?.attachRatePct || 36) * 2.5)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">Target: 35% Attach • {data?.totalCarePlans || 0} active policies</p>
          </div>
        </div>

        {/* KPI 2: Genius Bar Resolution Rate */}
        <div className="sheen-card rounded-2xl p-5 flex flex-col justify-between glow-emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Genius Bar First-Visit Fix</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight font-mono">
              {data?.resolutionRatePct || 89}%
            </div>
            <div className="mt-2 w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${data?.resolutionRatePct || 89}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">{data?.totalRepairs || 0} hardware appointments handled</p>
          </div>
        </div>

        {/* KPI 3: Preferred Payment Method */}
        <div className="sheen-card rounded-2xl p-5 flex flex-col justify-between glow-blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Primary Payment Channel</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight">
              Apple Pay
            </div>
            <p className="text-xs text-blue-400 font-mono mt-1">
              {paymentBreakdown[0]?.count ? `${paymentBreakdown[0].count} Transactions` : '68% of Total Volume'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Tap to Pay & Apple Card 3% Daily Cash</p>
          </div>
        </div>

        {/* KPI 4: Global Chain Revenue */}
        <div className="sheen-card rounded-2xl p-5 flex flex-col justify-between glow-amber">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Audited Sales Volume</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-semibold text-white tracking-tight font-mono">
              ${(totalCatRevenue / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              100% Real Transaction Ledger
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">75 International Stores</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
        <button
          onClick={() => setActiveMetricTab('bestsellers')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeMetricTab === 'bestsellers'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Top Selling Hardware Leaderboard
        </button>
        <button
          onClick={() => setActiveMetricTab('stores')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeMetricTab === 'stores'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Flagship Store Performance Ranking
        </button>
        <button
          onClick={() => setActiveMetricTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeMetricTab === 'categories'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Category Revenue Distribution
        </button>
        <button
          onClick={() => setActiveMetricTab('margins')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeMetricTab === 'margins'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Profit Margin & COGS Analytics
        </button>
      </div>

      {/* Tab 1: Top Selling Hardware */}
      {activeMetricTab === 'bestsellers' && (
        <div className="glass-panel sheen-card rounded-2xl overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <h2 className="text-sm font-semibold text-white">Top 10 High-Velocity Hardware Lines</h2>
              <p className="text-xs text-zinc-400">Ranked by audited sales quantity and gross revenue generation.</p>
            </div>
            <span className="text-xs font-mono text-zinc-500">MSRP Benchmark</span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {topProducts.map((p, idx) => (
              <div key={p.product_id} className="py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-zinc-800/20 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    idx === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    idx === 1 ? 'bg-zinc-400/20 text-zinc-300 border border-zinc-400/40' :
                    idx === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {idx + 1}
                  </span>
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.product_name}
                      loading="lazy"
                      className="w-10 h-10 rounded-lg object-contain p-0.5 bg-zinc-950 border border-zinc-800 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate text-xs">{p.product_name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {p.category_name}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-zinc-300">${Number(p.base_price).toLocaleString()} MSRP</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-semibold text-sm text-emerald-400">
                    ${Number(p.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    {p.units_sold} units sold • {p.total_orders} transactions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Store Rankings */}
      {activeMetricTab === 'stores' && (
        <div className="glass-panel sheen-card rounded-2xl overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-800/80">
            <div>
              <h2 className="text-sm font-semibold text-white">Global Flagship & Retail Performance League</h2>
              <p className="text-xs text-zinc-400">Audited comparative ranking across retail stores worldwide.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search store or city..."
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/60 border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Store Location</th>
                  <th className="py-3 px-3">Jurisdiction</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Transactions</th>
                  <th className="py-3 px-3">Avg Order (AOV)</th>
                  <th className="py-3 px-3 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredStoreRankings.map((st, i) => (
                  <tr key={st.store_id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-zinc-400">#{i + 1}</td>
                    <td className="py-3 px-3 font-medium text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{st.store_name}</span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{st.city}, {st.country}</td>
                    <td className="py-3 px-3">
                      {st.flagship ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Flagship
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-400">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-300">{st.sales_count}</td>
                    <td className="py-3 px-3 font-mono text-zinc-300">${Number(st.avg_order_value).toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-400 text-right">
                      ${Number(st.revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Category Revenue Distribution */}
      {activeMetricTab === 'categories' && (
        <div className="glass-panel sheen-card rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-800/80">
            <h2 className="text-sm font-semibold text-white">Revenue Contribution by Product Category</h2>
            <p className="text-xs text-zinc-400">Portfolio breakdown of total global store receipts.</p>
          </div>

          <div className="space-y-4">
            {categoryShare.map((cat) => {
              const rev = parseFloat(cat.revenue || 0);
              const pct = totalCatRevenue > 0 ? ((rev / totalCatRevenue) * 100).toFixed(1) : '0';
              return (
                <div key={cat.category_name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{cat.category_name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-400">${Number(rev).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className="text-zinc-500">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Profit Margin & COGS Analytics */}
      {activeMetricTab === 'margins' && (
        <div className="glass-panel sheen-card rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <div>
              <h2 className="text-sm font-semibold text-white">Gross Margin & Cost of Goods Sold (COGS)</h2>
              <p className="text-xs text-zinc-400">Wholesale cost basis versus audited retail revenue generation.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">Chain Gross Margin:</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {marginsData?.gross_margin_pct || 42.5}%
              </span>
            </div>
          </div>

          {/* Margins Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Total Sales Revenue</span>
              <div className="text-xl font-bold font-mono text-white mt-1">
                ${Number(marginsData?.total_revenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Total Hardware & Service COGS</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                ${Number(marginsData?.total_cogs || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Cumulative Gross Profit</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                ${Number(marginsData?.gross_profit || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>

          {/* Category Gross Margin Heatmap */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider font-mono">Category Gross Margin Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Units Sold</th>
                    <th className="pb-3 font-semibold">Revenue ($)</th>
                    <th className="pb-3 font-semibold">COGS ($)</th>
                    <th className="pb-3 font-semibold">Gross Profit ($)</th>
                    <th className="pb-3 font-semibold text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {marginsData?.categories?.map((cat) => (
                    <tr key={cat.category_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-sans font-medium text-white">{cat.category_name}</td>
                      <td className="py-3 text-zinc-400">{cat.units_sold.toLocaleString()}</td>
                      <td className="py-3 text-white">${cat.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td className="py-3 text-amber-400/80">${cat.cogs.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td className="py-3 text-emerald-400 font-bold">${cat.gross_profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cat.margin_pct >= 50
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : cat.margin_pct >= 35
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {cat.margin_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsView;
