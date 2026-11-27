import React, { useState } from "react";
import X from "lucide-react/dist/esm/icons/x.js";
import Lock from "lucide-react/dist/esm/icons/lock.js";
import ShieldAlert from "lucide-react/dist/esm/icons/shield-alert.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import Delete from "lucide-react/dist/esm/icons/delete.js";

export function ManagerPINModal({ isOpen, onClose, onAuthorized, actionTitle = "Managerial Override" }) {
  if (!isOpen) return null;

  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDigit = (d) => {
    if (pin.length < 4) {
      const nextPin = pin + d;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = async (candidatePin) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/manager/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: candidatePin, action: actionTitle })
      });
      const data = await res.json();
      if (!res.ok || !data.authorized) {
        throw new Error("Invalid Manager PIN. Access Denied.");
      }
      onAuthorized(data);
      onClose();
    } catch (err) {
      setError(err.message);
      setPin("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-zinc-100">
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl w-full max-w-xs p-6 text-center space-y-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">{actionTitle}</h2>
          <p className="text-xs text-zinc-400">Enter 4-Digit Manager Authorization Passcode</p>
        </div>

        {/* 4 PIN Dots */}
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                idx < pin.length
                  ? "bg-white scale-110 shadow-sm shadow-white/50"
                  : "border-2 border-zinc-700 bg-transparent"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[11px] text-red-400 font-medium animate-shake">
            {error}
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              disabled={submitting}
              onClick={() => handleDigit(String(num))}
              className="h-12 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-white font-mono text-lg font-semibold active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleDigit("0")}
            className="h-12 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-white font-mono text-lg font-semibold active:scale-95 transition-all shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            disabled={submitting || pin.length === 0}
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 font-mono">Default Manager PIN: 8888 or 1234</p>
      </div>
    </div>
  );
}

export default ManagerPINModal;
