import React, { useState } from "react";
import Activity from "lucide-react/dist/esm/icons/activity.js";
import Battery from "lucide-react/dist/esm/icons/battery.js";
import Cpu from "lucide-react/dist/esm/icons/cpu.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle.js";
import Printer from "lucide-react/dist/esm/icons/printer.js";
import { api } from "../services/api.js";

export function AST2DiagnosticsModal({ serialNumber, deviceModel, onClose }) {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState(null);
  const [inputSerial, setInputSerial] = useState(serialNumber || "");
  const [inputModel, setInputModel] = useState(deviceModel || "iPhone 16 Pro");

  const runDiagnosticSuite = async () => {
    setIsRunning(true);
    try {
      const data = await api.runDiagnostics({
        serial_number: inputSerial || "F2LM889X0Q11",
        device_model: inputModel,
      });
      // simulate realistic 1.2s benchmark test
      setTimeout(() => {
        setReport(data);
        setIsRunning(false);
      }, 1200);
    } catch (err) {
      alert(`Diagnostic test failed: ${err.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Apple Service Toolkit (AST 2)</h3>
              <p className="text-[11px] text-zinc-400">Internal Hardware Diagnostic & Calibration Suite</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Target Serial Number</label>
            <input
              type="text"
              value={inputSerial}
              onChange={(e) => setInputSerial(e.target.value)}
              placeholder="e.g. F2LM889X0Q11"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Device Model Family</label>
            <input
              type="text"
              value={inputModel}
              onChange={(e) => setInputModel(e.target.value)}
              placeholder="e.g. iPhone 16 Pro 256GB"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>

        <button
          onClick={runDiagnosticSuite}
          disabled={isRunning}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <Activity className={`w-4 h-4 ${isRunning ? "animate-spin text-zinc-700" : ""}`} />
          <span>{isRunning ? "Running AST 2 Hardware Benchmarks..." : "Run Comprehensive Diagnostics"}</span>
        </button>

        {/* Diagnostic Results */}
        {report && (
          <div className="space-y-4 pt-2 border-t border-zinc-800 animate-fade-in text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-zinc-500">Diagnostic Run ID</span>
                <p className="font-mono font-bold text-white text-sm">{report.ast2_run_id}</p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    report.status === "PASSED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {report.status === "PASSED" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {report.status}
                </span>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                  <Battery className="w-3 h-3 text-emerald-400" /> Battery Capacity
                </span>
                <p className="font-mono text-base font-bold text-white">
                  {report.telemetry.battery_maximum_capacity_pct}%
                </p>
                <p className="text-[10px] text-zinc-400">{report.telemetry.battery_condition}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-400" /> Cycle Count
                </span>
                <p className="font-mono text-base font-bold text-white">
                  {report.telemetry.battery_cycle_count} cycles
                </p>
                <p className="text-[10px] text-zinc-400">Target: &lt; 500</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Liquid Sensor (LCI)</span>
                <p
                  className={`font-mono text-xs font-bold ${
                    report.telemetry.liquid_contact_indicator.includes("TRIPPED")
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {report.telemetry.liquid_contact_indicator}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">TrueDepth Camera</span>
                <p className="font-mono text-xs font-bold text-emerald-400">
                  {report.telemetry.face_id_truedepth}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Neural Engine</span>
                <p className="font-mono text-xs font-bold text-zinc-200">
                  {report.telemetry.neural_engine_benchmark}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">SMART Storage</span>
                <p className="font-mono text-xs font-bold text-emerald-400">
                  {report.telemetry.storage_smart_status}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-[11px] text-zinc-300">
              <span className="font-semibold text-white">Recommended Technician Action: </span>
              {report.suggested_action}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print AST 2 Report</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default AST2DiagnosticsModal;
