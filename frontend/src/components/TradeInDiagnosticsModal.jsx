import React, { useState } from "react";
import X from "lucide-react/dist/esm/icons/x.js";
import BatteryCharging from "lucide-react/dist/esm/icons/battery-charging.js";
import ShieldAlert from "lucide-react/dist/esm/icons/shield-alert.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import Smartphone from "lucide-react/dist/esm/icons/smartphone.js";
import Lock from "lucide-react/dist/esm/icons/lock.js";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign.js";

export function TradeInDiagnosticsModal({ isOpen, onClose, onApplyCredit }) {
  if (!isOpen) return null;

  const [deviceModel, setDeviceModel] = useState("iPhone 15 Pro Max");
  const [serialNumber, setSerialNumber] = useState(`F17${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  const [batteryHealth, setBatteryHealth] = useState(88);
  const [screenCondition, setScreenCondition] = useState("Good"); // Pristine, Good, Scratched, Cracked
  const [casingCondition, setCasingCondition] = useState("Good"); // Pristine, Good, Scratched, Dented
  const [faceIdWorking, setFaceIdWorking] = useState(true);
  const [cameraWorking, setCameraWorking] = useState(true);
  const [icloudUnlocked, setIcloudUnlocked] = useState(true);
  
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRunDiagnostics = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trade-ins/diagnostics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_model: deviceModel,
          serial_number: serialNumber,
          battery_health_pct: batteryHealth,
          screen_condition: screenCondition,
          casing_condition: casingCondition,
          face_id_working: faceIdWorking,
          camera_working: cameraWorking,
          icloud_unlocked: icloudUnlocked
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Diagnostics evaluation rejected");
      }
      setDiagnosticResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToCart = () => {
    if (!diagnosticResult) return;
    if (onApplyCredit) {
      onApplyCredit(diagnosticResult.assessed_credit, diagnosticResult.device_model, diagnosticResult.diagnostic_code);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">Apple Trade-In Diagnostics Suite</h2>
              <p className="text-xs text-zinc-400">Official Hardware Diagnostic Grading & Valuation Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {!diagnosticResult ? (
            <form onSubmit={handleRunDiagnostics} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Device Model</label>
                  <select
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium focus:outline-none focus:border-white/30 text-xs"
                  >
                    <option value="iPhone 16 Pro Max">iPhone 16 Pro Max</option>
                    <option value="iPhone 16 Pro">iPhone 16 Pro</option>
                    <option value="iPhone 16">iPhone 16</option>
                    <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="iPhone 15">iPhone 15</option>
                    <option value="iPhone 14 Pro Max">iPhone 14 Pro Max</option>
                    <option value="iPhone 14">iPhone 14</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="MacBook Pro 14">MacBook Pro 14-inch</option>
                    <option value="MacBook Air 13">MacBook Air 13-inch</option>
                    <option value="iPad Pro 11">iPad Pro 11-inch</option>
                    <option value="Apple Watch Ultra 2">Apple Watch Ultra 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Hardware Serial #</label>
                  <input
                    type="text"
                    required
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-white/30 text-xs"
                  />
                </div>
              </div>

              {/* Battery Health Slider */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-medium flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    Battery Maximum Capacity
                  </span>
                  <span className={`font-mono font-bold text-sm ${batteryHealth >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {batteryHealth}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block">
                  {batteryHealth < 80 ? "⚠️ Below 80%: Battery service deduction applied (-$80)" : "✓ Normal Peak Performance Capability"}
                </span>
              </div>

              {/* Cosmetic Condition Grids */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Display Enclosure Condition</label>
                  <select
                    value={screenCondition}
                    onChange={(e) => setScreenCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white/30 text-xs"
                  >
                    <option value="Pristine">Pristine (No blemishes)</option>
                    <option value="Good">Good (Micro scratches)</option>
                    <option value="Scratched">Deep Scratches (-$40)</option>
                    <option value="Cracked">Cracked / OLED Bleed (-$160)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Chassis & Bezel Condition</label>
                  <select
                    value={casingCondition}
                    onChange={(e) => setCasingCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white/30 text-xs"
                  >
                    <option value="Pristine">Pristine (Flawless edges)</option>
                    <option value="Good">Good (Normal wear)</option>
                    <option value="Scratched">Visible Scratches (-$30)</option>
                    <option value="Dented">Corner Dent / Impact (-$70)</option>
                  </select>
                </div>
              </div>

              {/* Hardware Diagnostic Toggles */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5">
                <span className="font-semibold text-zinc-300 block mb-1">AST2 Component Verification</span>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-400">TrueDepth / Face ID Sensor Passed</span>
                  <input
                    type="checkbox"
                    checked={faceIdWorking}
                    onChange={(e) => setFaceIdWorking(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-zinc-400">Optical Camera & Telephoto Passed</span>
                  <input
                    type="checkbox"
                    checked={cameraWorking}
                    onChange={(e) => setCameraWorking(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-zinc-800">
                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    iCloud Find My / Activation Lock Disassociated
                  </span>
                  <input
                    type="checkbox"
                    checked={icloudUnlocked}
                    onChange={(e) => setIcloudUnlocked(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
                  />
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-apple-primary w-full py-2.5 rounded-xl text-black font-semibold text-xs flex items-center justify-center gap-2"
              >
                {loading ? "Running Hardware Diagnostic Analysis..." : "Calculate Appraisal & Generate Quote"}
              </button>
            </form>
          ) : (
            /* Diagnostic Certificate Result Screen */
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/40 glow-emerald space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                      Official Appraisal Certificate
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{diagnosticResult.device_model}</h3>
                    <p className="text-[11px] font-mono text-zinc-400">Serial: {diagnosticResult.serial_number}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {diagnosticResult.grade}
                    </span>
                    <div className="text-2xl font-black font-mono text-emerald-400 mt-2">
                      ${diagnosticResult.assessed_credit}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">Store Credit</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 text-[11px] space-y-1 font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Base Model Valuation:</span>
                    <span className="text-white">${diagnosticResult.base_valuation}</span>
                  </div>
                  {diagnosticResult.deductions_detail?.map((d, i) => (
                    <div key={i} className="flex justify-between text-red-400">
                      <span>{d.item}:</span>
                      <span>{d.amount}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-zinc-400 pt-1">
                    <span>Diagnostic Certificate ID:</span>
                    <span className="text-blue-400 font-bold">{diagnosticResult.diagnostic_code}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDiagnosticResult(null)}
                  className="btn-apple-secondary flex-1 py-2.5 rounded-xl text-zinc-400 hover:text-white"
                >
                  Recalculate
                </button>
                <button
                  type="button"
                  onClick={handleApplyToCart}
                  className="btn-apple-primary flex-1 py-2.5 rounded-xl text-black font-semibold flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-black" />
                  <span>Apply Credit to Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradeInDiagnosticsModal;
