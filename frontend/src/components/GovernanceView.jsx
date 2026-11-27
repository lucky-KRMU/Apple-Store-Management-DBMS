import React, { useState, useEffect } from "react";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check.js";
import ShieldAlert from "lucide-react/dist/esm/icons/shield.js";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";
import Users from "lucide-react/dist/esm/icons/users.js";
import Activity from "lucide-react/dist/esm/icons/activity.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle.js";
import { api } from "../services/api.js";

export function GovernanceView({ selectedStoreId, currentRole, onRoleChange }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogJson, setSelectedLogJson] = useState(null);

  useEffect(() => {
    loadAuditLogs();
  }, [selectedStoreId]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs(selectedStoreId ? { store_id: selectedStoreId } : {});
      setLogs(data);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "Specialist",
      title: "Store Specialist",
      desc: "POS checkout, hardware inventory lookups, customer intake, Today at Apple RSVP",
      canPOS: true,
      canGenius: false,
      canSupplyChain: false,
      canAdmin: false,
    },
    {
      id: "Genius",
      title: "Genius / Technician",
      desc: "Genius Bar repairs, AST 2 hardware diagnostics, repair parts BOM deduction",
      canPOS: true,
      canGenius: true,
      canSupplyChain: false,
      canAdmin: false,
    },
    {
      id: "Inventory",
      title: "Inventory Logistics Lead",
      desc: "Stock intake, inter-store transfers dispatch & receiving, blind cycle counts",
      canPOS: false,
      canGenius: false,
      canSupplyChain: true,
      canAdmin: false,
    },
    {
      id: "Manager",
      title: "Store General Manager",
      desc: "Full store oversight, transfer approvals, trade-in overrides, store revenue analytics",
      canPOS: true,
      canGenius: true,
      canSupplyChain: true,
      canAdmin: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Enterprise Governance & Security
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RBAC & Audit Trail
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Enterprise role-based permissions, tamper-proof system audit logs, and PostgreSQL ACID transaction isolation telemetry.
          </p>
        </div>

        <button
          onClick={loadAuditLogs}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors self-start sm:self-auto"
          title="Refresh Audit Logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Role-Based Access Control (RBAC) Switcher & Matrix */}
      <div className="glass-panel sheen-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Role-Based Access Control (RBAC) Matrix</h2>
            <p className="text-xs text-zinc-400">Switch active role to test system authorization boundaries.</p>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentRole === r.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {roles.map((role) => {
            const isCurrent = currentRole === role.id;
            return (
              <div
                key={role.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-zinc-900 border-zinc-500 shadow-lg ring-1 ring-zinc-500/50"
                    : "bg-zinc-900/40 border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">{role.title}</h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white text-black">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">{role.desc}</p>
                <div className="space-y-1.5 border-t border-zinc-800 pt-3 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">POS Checkout:</span>
                    <span className={role.canPOS ? "text-emerald-400 font-semibold" : "text-zinc-600"}>
                      {role.canPOS ? "Granted" : "Restricted"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Genius Bench:</span>
                    <span className={role.canGenius ? "text-emerald-400 font-semibold" : "text-zinc-600"}>
                      {role.canGenius ? "Granted" : "Restricted"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Supply Transfers:</span>
                    <span className={role.canSupplyChain ? "text-emerald-400 font-semibold" : "text-zinc-600"}>
                      {role.canSupplyChain ? "Granted" : "Restricted"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Store Overrides:</span>
                    <span className={role.canAdmin ? "text-emerald-400 font-semibold" : "text-zinc-600"}>
                      {role.canAdmin ? "Granted" : "Restricted"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Audit Trail Table */}
      <div className="glass-panel sheen-card rounded-2xl overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Tamper-Proof Audit Trail</h2>
            <p className="text-xs text-zinc-400">Chronological immutable event ledger recorded to PostgreSQL.</p>
          </div>
          <span className="text-xs font-mono text-zinc-500">{logs.length} Logged Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Store Location</th>
                <th className="py-2.5 px-3">Specialist</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 font-sans">
                    No audit records found for this store.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(log.created_at).toLocaleString([], {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">{log.entity_name}</td>
                    <td className="py-3 px-3 text-blue-400 font-semibold">{log.record_id || "—"}</td>
                    <td className="py-3 px-3 font-sans text-zinc-300">{log.store_name || log.store_id || "Global"}</td>
                    <td className="py-3 px-3 font-sans text-zinc-400">{log.employee_name || "Specialist"}</td>
                    <td className="py-3 px-3 text-right">
                      {log.details ? (
                        <button
                          onClick={() => setSelectedLogJson(log)}
                          className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-sans transition-colors"
                        >
                          Inspect JSON
                        </button>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspection Modal */}
      {selectedLogJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">
                Audit Record #{selectedLogJson.log_id} Payload
              </h3>
              <button
                onClick={() => setSelectedLogJson(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                <span>Action: {selectedLogJson.action}</span>
                <span>Entity: {selectedLogJson.entity_name}</span>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto max-h-72">
                {JSON.stringify(selectedLogJson.details, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedLogJson(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GovernanceView;
