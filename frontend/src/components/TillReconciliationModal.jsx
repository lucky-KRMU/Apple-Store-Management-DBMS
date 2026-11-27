import React, { useState, useEffect } from "react";
import X from "lucide-react/dist/esm/icons/x.js";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign.js";
import Lock from "lucide-react/dist/esm/icons/lock.js";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check.js";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle.js";
import ArrowDownRight from "lucide-react/dist/esm/icons/arrow-down-right.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import Download from "lucide-react/dist/esm/icons/download.js";

export function TillReconciliationModal({ isOpen, onClose, storeId = "ST-1", registerId = "REG-01" }) {
  if (!isOpen) return null;

  const [currentTill, setCurrentTill] = useState(null);
  const [actualCashCounted, setActualCashCounted] = useState("");
  const [managerPin, setManagerPin] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [reconciliationResult, setReconciliationResult] = useState(null);

  // Vault Drop Sub-mode
  const [isVaultDropMode, setIsVaultDropMode] = useState(false);
  const [vaultDropAmount, setVaultDropAmount] = useState("");
  const [vaultBagSerial, setVaultBagSerial] = useState(`BAG-${Date.now().toString(36).toUpperCase()}`);
  const [vaultSuccess, setVaultSuccess] = useState(false);

  useEffect(() => {
    fetchCurrentTill();
  }, [storeId, registerId]);

  const fetchCurrentTill = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reconciliation/current?store_id=${storeId}&register_id=${registerId}`);
      const data = await res.json();
      setCurrentTill(data);
      if (data.expected_cash) {
        setActualCashCounted(data.expected_cash.toFixed(2));
      }
    } catch (e) {
      console.error("Failed to fetch till data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reconciliation/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: storeId,
          register_id: registerId,
          manager_pin: managerPin,
          opening_float: currentTill?.opening_float || 500,
          actual_cash_counted: parseFloat(actualCashCounted) || 0,
          notes: notes.trim() || "End of business day closing balancing"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Reconciliation failed");
      }
      setReconciliationResult(data.reconciliation);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVaultDrop = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reconciliation/vault-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: storeId,
          amount: parseFloat(vaultDropAmount) || 0,
          bag_serial: vaultBagSerial,
          notes: "Midday secure armored transport vault drop"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Vault drop failed");
      setVaultSuccess(true);
      fetchCurrentTill();
      setTimeout(() => {
        setIsVaultDropMode(false);
        setVaultSuccess(false);
        setVaultDropAmount("");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const expectedCash = currentTill?.expected_cash || 500;
  const counted = parseFloat(actualCashCounted) || 0;
  const variance = counted - expectedCash;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">End-of-Day Till Reconciliation</h2>
              <p className="text-xs text-zinc-400 font-mono">Store: {storeId} • Register: {registerId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {reconciliationResult ? (
            /* Reconciliation Closed Result Slip */
            <div className="p-6 rounded-2xl bg-zinc-950 border border-emerald-500/40 glow-emerald space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Register Balancing Certified</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {reconciliationResult.reconciliation_code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block">Expected Cash:</span>
                  <span className="text-white font-bold">${Number(reconciliationResult.expected_cash).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Counted Cash:</span>
                  <span className="text-emerald-400 font-bold">${Number(reconciliationResult.actual_cash_counted).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Variance:</span>
                  <span className={`font-bold ${Math.abs(Number(reconciliationResult.variance)) < 0.01 ? "text-emerald-400" : "text-amber-400"}`}>
                    ${Number(reconciliationResult.variance).toFixed(2)} ({reconciliationResult.status})
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Opening Float:</span>
                  <span className="text-zinc-300">${Number(reconciliationResult.opening_float).toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={onClose}
                  className="btn-apple-primary px-5 py-2 rounded-xl text-black font-semibold text-xs"
                >
                  Done & Lock Register
                </button>
              </div>
            </div>
          ) : isVaultDropMode ? (
            /* Vault Drop Mode Form */
            <form onSubmit={handleVaultDrop} className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-amber-400" />
                  Midday Cash Vault Drop
                </h3>
                <button
                  type="button"
                  onClick={() => setIsVaultDropMode(false)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Back to Register
                </button>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Drop Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={vaultDropAmount}
                  onChange={(e) => setVaultDropAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Security Bag Serial #</label>
                <input
                  type="text"
                  required
                  value={vaultBagSerial}
                  onChange={(e) => setVaultBagSerial(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                />
              </div>

              {vaultSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Vault drop logged successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !vaultDropAmount}
                className="btn-apple-primary w-full py-2.5 rounded-xl text-black font-semibold text-xs"
              >
                {submitting ? "Logging Drop..." : "Seal Bag & Confirm Drop"}
              </button>
            </form>
          ) : (
            /* Standard Register Closing Form */
            <form onSubmit={handleCloseRegister} className="space-y-5">
              {/* Live Tally Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block">OPENING FLOAT</span>
                  <span className="text-white font-bold">${currentTill?.opening_float?.toFixed(2) || "500.00"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">CASH SALES</span>
                  <span className="text-emerald-400 font-bold">${currentTill?.cash_sales?.toFixed(2) || "0.00"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">APPLE PAY</span>
                  <span className="text-blue-400 font-bold">${currentTill?.apple_pay_sales?.toFixed(2) || "0.00"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">CARD SALES</span>
                  <span className="text-purple-400 font-bold">${currentTill?.card_sales?.toFixed(2) || "0.00"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">VAULT DROPS</span>
                  <span className="text-amber-400 font-bold">-${currentTill?.vault_drops?.toFixed(2) || "0.00"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">EXPECTED CASH</span>
                  <span className="text-white font-bold text-sm">${expectedCash.toFixed(2)}</span>
                </div>
              </div>

              {/* Physical Cash Count Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Actual Cash in Drawer ($)</label>
                  <button
                    type="button"
                    onClick={() => setIsVaultDropMode(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Midday Vault Drop</span>
                  </button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={actualCashCounted}
                  onChange={(e) => setActualCashCounted(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-lg font-bold focus:outline-none focus:border-white/40"
                />

                {/* Live Variance Calculation Badge */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <span className="text-zinc-400">Drawer Variance:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      Math.abs(variance) < 0.01
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                        : variance > 0
                        ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                        : "text-red-400 bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    {variance > 0 ? `+$${variance.toFixed(2)} (Over)` : variance < 0 ? `-$${Math.abs(variance).toFixed(2)} (Short)` : "$0.00 (Balanced)"}
                  </span>
                </div>
              </div>

              {/* Manager Passcode Verification */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <label className="block text-zinc-300 font-medium flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Manager Security Passcode (Required for Closing Sign-off)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter 4-digit Manager PIN (e.g. 8888 or 1234)"
                  value={managerPin}
                  onChange={(e) => setManagerPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 font-mono text-xs focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Closing Register Notes</label>
                <input
                  type="text"
                  placeholder="Optional notes or cash drawer audit comments..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white/30"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-apple-primary w-full py-3 rounded-xl text-black font-semibold text-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>{submitting ? "Balancing Register..." : "Submit Reconciliation & Lock Drawer"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default TillReconciliationModal;
