import React, { useState } from 'react';
import X from 'lucide-react/dist/esm/icons/x.js';
import Wrench from 'lucide-react/dist/esm/icons/wrench.js';
import Package from 'lucide-react/dist/esm/icons/package.js';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2.js';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle.js';
import { api } from '../services/api.js';

export function IssuePartModal({ appointment, parts, onClose, onIssued }) {
  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.part_id || '');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const selectedPart = parts.find(p => String(p.part_id) === String(selectedPartId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartId) {
      setError('Please select a replacement component.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await api.useGeniusPart({
        appointment_id: appointment.appointment_id,
        part_id: parseInt(selectedPartId, 10),
        quantity: parseInt(quantity, 10)
      });
      if (onIssued) onIssued();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to issue part.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Issue OEM Replacement Part</h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Ticket #{appointment.appointment_id} • {appointment.customer_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Select Component from Bench Stock</label>
            <select
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white/30"
              required
            >
              {parts.length === 0 ? (
                <option value="">No parts cataloged for this location</option>
              ) : (
                parts.map((p) => (
                  <option key={p.part_id} value={p.part_id} className="bg-zinc-900">
                    {p.part_number} — {p.name} ({p.stock_quantity} in stock) • ${Number(p.unit_cost).toFixed(2)}
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedPart && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Part SKU:</span>
                <span className="font-mono text-white font-semibold">{selectedPart.part_number}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Category:</span>
                <span className="text-zinc-200">{selectedPart.category}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Compatible Hardware:</span>
                <span className="text-zinc-200">{selectedPart.compatible_product_name || selectedPart.compatible_product_id}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Stock on Hand:</span>
                <span className={`font-mono font-bold ${selectedPart.stock_quantity <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedPart.stock_quantity} units
                </span>
              </div>
              <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800">
                <span>Warranty / Part Cost:</span>
                <span className="font-mono text-white font-semibold">${Number(selectedPart.unit_cost).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">Quantity to Issue</label>
            <input
              type="number"
              min="1"
              max={selectedPart?.stock_quantity || 5}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-white/30"
              required
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedPart || selectedPart.stock_quantity === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Package className="w-4 h-4" />
              <span>{submitting ? 'Deducting Stock...' : 'Confirm Part Issuance'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssuePartModal;
