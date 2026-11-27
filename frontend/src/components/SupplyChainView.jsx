import React, { useState, useEffect } from "react";
import ArrowLeftRight from "lucide-react/dist/esm/icons/arrow-left-right.js";
import Package from "lucide-react/dist/esm/icons/package.js";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle.js";
import Clock from "lucide-react/dist/esm/icons/clock.js";
import Building2 from "lucide-react/dist/esm/icons/building-2.js";
import Search from "lucide-react/dist/esm/icons/search.js";
import ClipboardList from "lucide-react/dist/esm/icons/clipboard-list.js";
import { api } from "../services/api.js";

export function SupplyChainView({ stores, selectedStoreId, products = [], onRefresh }) {
  const [activeSubTab, setActiveSubTab] = useState("transfers"); // transfers | replenishment | audit
  const [transfers, setTransfers] = useState([]);
  const [replenishments, setReplenishments] = useState([]);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Transfer Modal
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [destStoreId, setDestStoreId] = useState("");
  const [transferSerialsInput, setTransferSerialsInput] = useState("");
  const [transferNotes, setTransferNotes] = useState("");
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  // New Replenishment Modal
  const [isNewReplenishOpen, setIsNewReplenishOpen] = useState(false);
  const [replenishProductId, setReplenishProductId] = useState("");
  const [replenishQty, setReplenishQty] = useState(15);
  const [isSubmittingReplenish, setIsSubmittingReplenish] = useState(false);

  // Cycle Audit State
  const [auditInput, setAuditInput] = useState("");
  const [auditNotes, setAuditNotes] = useState("");
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [lastAuditResult, setLastAuditResult] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedStoreId, activeSubTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const queryParams = selectedStoreId ? { store_id: selectedStoreId } : {};
      if (activeSubTab === "transfers") {
        const data = await api.getTransfers(queryParams);
        setTransfers(data);
      } else if (activeSubTab === "replenishment") {
        const data = await api.getReplenishments(queryParams);
        setReplenishments(data);
      } else if (activeSubTab === "audit") {
        const data = await api.getAudits(queryParams);
        setAudits(data);
      }
    } catch (err) {
      console.error("Failed to load supply chain data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReplenishment = async (e) => {
    e.preventDefault();
    if (!replenishProductId) {
      alert("Please select a product to restock.");
      return;
    }
    try {
      setIsSubmittingReplenish(true);
      await api.createReplenishment({
        store_id: selectedStoreId || "ST-1",
        product_id: replenishProductId,
        quantity_requested: parseInt(replenishQty, 10)
      });
      setIsNewReplenishOpen(false);
      setReplenishProductId("");
      setReplenishQty(15);
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Replenishment request failed: ${err.message}`);
    } finally {
      setIsSubmittingReplenish(false);
    }
  };

  const handleAdvanceReplenishment = async (orderId, nextStatus) => {
    try {
      await api.updateReplenishmentStatus(orderId, { status: nextStatus });
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleCreateTransfer = async (e) => {
    e.preventDefault();
    const serials = transferSerialsInput
      .split(/[\n, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!destStoreId) {
      alert("Please select a destination store.");
      return;
    }
    if (serials.length === 0) {
      alert("Please enter at least one device serial number to transfer.");
      return;
    }

    try {
      setIsSubmittingTransfer(true);
      await api.createTransfer({
        source_store_id: selectedStoreId || "ST-1",
        destination_store_id: destStoreId,
        serial_numbers: serials,
        notes: transferNotes,
      });
      setIsNewTransferOpen(false);
      setTransferSerialsInput("");
      setTransferNotes("");
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Transfer creation failed: ${err.message}`);
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const handleAdvanceTransfer = async (transferId, nextStatus) => {
    try {
      await api.updateTransferStatus(transferId, { status: nextStatus });
      await loadData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleRunAudit = async (e) => {
    e.preventDefault();
    const serials = auditInput
      .split(/[\n, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (serials.length === 0) {
      alert("Please paste or scan physical serial numbers to audit.");
      return;
    }

    try {
      setIsSubmittingAudit(true);
      const res = await api.createAudit({
        store_id: selectedStoreId || "ST-1",
        scanned_serials: serials,
        notes: auditNotes || "Drawer stock cycle audit",
      });
      setLastAuditResult(res.audit);
      setAuditInput("");
      setAuditNotes("");
      await loadData();
    } catch (err) {
      alert(`Audit failed: ${err.message}`);
    } finally {
      setIsSubmittingAudit(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending Approval
          </span>
        );
      case "Approved":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case "In Transit":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1 animate-pulse">
            <ArrowLeftRight className="w-3 h-3" /> In Transit
          </span>
        );
      case "Received":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Received & Stocked
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Supply Chain & Multi-Store Logistics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Enterprise Hub
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage inter-store stock transfers, replenishment cycles, and blind drawer inventory audits across global Apple stores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === "transfers" && (
            <button
              onClick={() => setIsNewTransferOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Initiate Stock Transfer</span>
            </button>
          )}
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Refresh Supply Chain Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
        <button
          onClick={() => setActiveSubTab("transfers")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeSubTab === "transfers"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Inter-Store Transfers ({transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("replenishment")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeSubTab === "replenishment"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Replenishment Orders ({replenishments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeSubTab === "audit"
              ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Blind Cycle Audits ({audits.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === "transfers" && (
        <div className="space-y-4">
          <div className="glass-panel sheen-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Transfer Code</th>
                    <th className="py-3 px-4">Origin Store</th>
                    <th className="py-3 px-4">Destination Store</th>
                    <th className="py-3 px-4">Units</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-500">
                        No active stock transfers found for this store.
                      </td>
                    </tr>
                  ) : (
                    transfers.map((t) => (
                      <tr key={t.transfer_id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-white">
                          {t.transfer_code}
                          {t.notes && (
                            <p className="text-[10px] text-zinc-500 truncate max-w-xs font-sans">
                              {t.notes}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-zinc-200 font-medium">{t.source_store_name}</span>
                          <span className="text-[10px] text-zinc-500 block">ID: {t.source_store_id}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-zinc-200 font-medium">{t.destination_store_name}</span>
                          <span className="text-[10px] text-zinc-500 block">ID: {t.destination_store_id}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-mono text-zinc-200 font-bold">
                            {t.items_count} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(t.status)}</td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          {new Date(t.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {t.status === "Pending" && (
                              <button
                                onClick={() => handleAdvanceTransfer(t.transfer_id, "Approved")}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium text-[11px] transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {t.status === "Approved" && (
                              <button
                                onClick={() => handleAdvanceTransfer(t.transfer_id, "In Transit")}
                                className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium text-[11px] transition-colors"
                              >
                                Dispatch
                              </button>
                            )}
                            {t.status === "In Transit" && (
                              <button
                                onClick={() => handleAdvanceTransfer(t.transfer_id, "Received")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-[11px] transition-colors"
                              >
                                Receive & Restock
                              </button>
                            )}
                            {t.status === "Received" && (
                              <span className="text-zinc-500 text-[11px]">Reconciled</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Replenishment Tab */}
      {activeSubTab === "replenishment" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="glass-panel sheen-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div>
                  <h2 className="text-sm font-semibold text-white">Safety Stock Automated Replenishment</h2>
                  <p className="text-xs text-zinc-400">Restock orders routed to regional distribution warehouses.</p>
                </div>
                <button
                  onClick={() => setIsNewReplenishOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-black" />
                  <span>Request Restock</span>
                </button>
              </div>

              <div className="space-y-3">
                {replenishments.length === 0 ? (
                  <p className="py-8 text-center text-xs text-zinc-500">No active replenishment orders for this location.</p>
                ) : (
                  replenishments.map((r) => (
                    <div key={r.order_id} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-white">{r.product_name}</p>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Order ID: #{r.order_id} • Store: {r.store_name}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded-md font-semibold">
                          {r.quantity_requested} units
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          r.status === 'Dispatched' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {r.status}
                        </span>

                        {r.status === 'Submitted' && (
                          <button
                            onClick={() => handleAdvanceReplenishment(r.order_id, 'Dispatched')}
                            className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-medium text-[11px] transition-colors"
                          >
                            Dispatch
                          </button>
                        )}
                        {r.status === 'Dispatched' && (
                          <button
                            onClick={() => handleAdvanceReplenishment(r.order_id, 'Delivered')}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-medium text-[11px] transition-colors"
                          >
                            Receive & Restock
                          </button>
                        )}
                        {r.status === 'Delivered' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel sheen-card rounded-2xl p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Replenishment Logic</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When sellable inventory drops below the safety threshold (default: 5 units), an automated purchase order is routed to the regional distribution warehouse.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Threshold Trigger:</span>
                  <span className="text-zinc-300 font-mono font-medium">&lt; 5 Units</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Standard Batch Size:</span>
                  <span className="text-zinc-300 font-mono font-medium">10 - 25 Units</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Restock Action:</span>
                  <span className="text-emerald-400 font-medium">Instant Inventory Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cycle Audit Tab */}
      {activeSubTab === "audit" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 glass-panel sheen-card rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Blind Physical Serial Count</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Scan or paste physical 12-character serials from drawer racks. The system reconciles them against database records.
              </p>
            </div>

            <form onSubmit={handleRunAudit} className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Serial Numbers (one per line or comma-separated)
                </label>
                <textarea
                  value={auditInput}
                  onChange={(e) => setAuditInput(e.target.value)}
                  placeholder="F2LM889X0Q11&#10;C02F998KMD6R&#10;DMPZ772L0992..."
                  rows={6}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Audit Notes</label>
                <input
                  type="text"
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="e.g., Drawer A-04 iPhone 16 Pro verification"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAudit}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-md transition-colors"
              >
                {isSubmittingAudit ? "Reconciling..." : "Run Reconciled Cycle Count"}
              </button>
            </form>

            {lastAuditResult && (
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
                <p className="font-semibold text-white">Audit Reconciled Results:</p>
                <div className="flex justify-between">
                  <span className="text-emerald-400">Matched In Stock:</span>
                  <span className="font-mono font-bold text-white">{lastAuditResult.matched_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-400">Missing from Drawer:</span>
                  <span className="font-mono font-bold text-white">{lastAuditResult.missing_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">Unexpected / Misplaced:</span>
                  <span className="font-mono font-bold text-white">{lastAuditResult.unexpected_count}</span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 glass-panel sheen-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Audit History Trail</h3>
            <div className="space-y-3">
              {audits.map((a) => (
                <div key={a.audit_id} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-white">{a.notes || "Cycle Inventory Audit"}</p>
                    <p className="text-[11px] text-zinc-500">
                      Conducted by {a.conducted_by_name || "Specialist"} • {new Date(a.audit_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-emerald-400 font-semibold">{a.matched_count} Match</span>
                    <span className="text-amber-400 font-semibold">{a.missing_count} Miss</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Transfer Modal */}
      {isNewTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-semibold text-white">Initiate Inter-Store Transfer</h3>
              </div>
              <button
                onClick={() => setIsNewTransferOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Destination Apple Store</label>
                <select
                  value={destStoreId}
                  onChange={(e) => setDestStoreId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200 focus:outline-none focus:border-zinc-500"
                >
                  <option value="">Select Destination Store...</option>
                  {stores
                    .filter((s) => String(s.store_id) !== String(selectedStoreId))
                    .map((s) => (
                      <option key={s.store_id} value={s.store_id}>
                        {s.store_name} ({s.city}, {s.country})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">
                  Serial Numbers to Transfer (one per line or comma-separated)
                </label>
                <textarea
                  value={transferSerialsInput}
                  onChange={(e) => setTransferSerialsInput(e.target.value)}
                  placeholder="F2LM889X0Q11&#10;C02F998KMD6R..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Transfer Logistics Reason / Notes</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="e.g. Urgent stock rebalancing for weekend launch rush"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewTransferOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTransfer}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                >
                  {isSubmittingTransfer ? "Submitting..." : "Submit Transfer Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Replenishment Request Modal */}
      {isNewReplenishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Request Stockroom Replenishment</h3>
              </div>
              <button
                onClick={() => setIsNewReplenishOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReplenishment} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Select Hardware Product</label>
                <select
                  value={replenishProductId}
                  onChange={(e) => setReplenishProductId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-200 focus:outline-none focus:border-zinc-500"
                  required
                >
                  <option value="">-- Choose Product to Replenish --</option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.name} (${Number(p.base_price).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Quantity Requested (Batch Units)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={replenishQty}
                  onChange={(e) => setReplenishQty(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-zinc-500"
                  required
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Standard warehouse fulfillment pallets: 10, 15, 25, or 50 units.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewReplenishOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReplenish}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                >
                  {isSubmittingReplenish ? "Submitting..." : "Submit Replenishment Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplyChainView;
