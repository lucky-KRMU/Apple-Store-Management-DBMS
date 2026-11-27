import React, { useState, useEffect } from "react";
import Monitor from "lucide-react/dist/esm/icons/monitor.js";
import Clock from "lucide-react/dist/esm/icons/clock.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";
import Wrench from "lucide-react/dist/esm/icons/wrench.js";
import { api } from "../services/api.js";

export function LiveQueueModal({ storeId, storeName, onClose }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadQueue();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const queuePoll = setInterval(loadQueue, 5000);
    return () => {
      clearInterval(timer);
      clearInterval(queuePoll);
    };
  }, [storeId]);

  const loadQueue = async () => {
    try {
      const data = await api.getGeniusQueue(storeId || "ST-1");
      setQueue(data);
    } catch (err) {
      console.error("Failed to load queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const inProgressList = queue.filter((q) => q.status === "In Progress");
  const waitingList = queue.filter((q) => q.status === "Scheduled");

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col p-6 sm:p-10 select-none animate-fade-in overflow-y-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Genius Bar Live Queue</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Display
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{storeName || "Apple Retail Store"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <span className="text-sm font-semibold text-zinc-200">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span className="text-[11px] text-zinc-500 block">
              {currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          <button
            onClick={loadQueue}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
          >
            Exit Display Mode
          </button>
        </div>
      </div>

      {/* Main Board Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Column: NOW SERVING */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
              <h2 className="text-sm font-bold tracking-wider uppercase text-purple-400">
                Now Serving at Tables
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{inProgressList.length} Sessions Active</span>
          </div>

          <div className="space-y-3">
            {inProgressList.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 text-xs bg-[#121214] rounded-2xl border border-zinc-800">
                No active diagnostic sessions currently in progress.
              </div>
            ) : (
              inProgressList.map((item) => (
                <div
                  key={item.appointment_id}
                  className="bg-gradient-to-r from-purple-950/30 to-[#121214] border border-purple-500/30 rounded-2xl p-5 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01]"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-purple-400">
                      {item.location_callout}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.customer_name}</h3>
                    <p className="text-xs text-zinc-400">
                      {item.device_name || "Apple Hardware"} • Specialist: {item.genius_name}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                      In Diagnostic
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: UP NEXT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h2 className="text-sm font-bold tracking-wider uppercase text-blue-400">
                Up Next (Waiting Area)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{waitingList.length} In Queue</span>
          </div>

          <div className="space-y-3">
            {waitingList.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 text-xs bg-[#121214] rounded-2xl border border-zinc-800">
                Waiting queue is currently clear.
              </div>
            ) : (
              waitingList.map((item, idx) => (
                <div
                  key={item.appointment_id}
                  className="bg-[#121214] border border-zinc-800 rounded-2xl p-4 shadow-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-sm text-zinc-400">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.customer_name}</h4>
                      <p className="text-xs text-zinc-500">
                        {item.issue_description?.slice(0, 45) || "Diagnostics"}...
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-zinc-400">
                    <span>
                      {new Date(item.appointment_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-[10px] text-zinc-600 block">Est. 5 min wait</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-800 text-center text-[11px] text-zinc-600 font-mono">
        Apple StoreOS High-Availability Diagnostic Queue Engine • PostgreSQL Real-Time
      </div>
    </div>
  );
}

export default LiveQueueModal;
