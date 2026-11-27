import React, { useState, useEffect } from "react";
import Users from "lucide-react/dist/esm/icons/users.js";
import Clock from "lucide-react/dist/esm/icons/clock.js";
import Award from "lucide-react/dist/esm/icons/award.js";
import Calendar from "lucide-react/dist/esm/icons/calendar.js";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check.js";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import Coffee from "lucide-react/dist/esm/icons/coffee.js";
import LogOut from "lucide-react/dist/esm/icons/log-out.js";
import LogIn from "lucide-react/dist/esm/icons/log-in.js";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";

export function SpecialistWorkforceView({ stores, selectedStoreId, employees = [] }) {
  const [activeTab, setActiveTab] = useState("incentives"); // incentives | timeclock | schedules
  const [activeStore, setActiveStore] = useState(selectedStoreId || "ST-1");
  const [performance, setPerformance] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time Clock Action State
  const [clockEmpId, setClockEmpId] = useState("");
  const [clockAction, setClockAction] = useState("clock_in");
  const [clockNotes, setClockNotes] = useState("");
  const [clockMsg, setClockMsg] = useState(null);

  // Schedule New Shift Modal State
  const [isNewShiftOpen, setIsNewShiftOpen] = useState(false);
  const [shiftEmpId, setShiftEmpId] = useState("");
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split("T")[0]);
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("17:30");
  const [shiftRole, setShiftRole] = useState("Specialist POS");

  useEffect(() => {
    loadWorkforceData();
  }, [activeStore, activeTab]);

  const loadWorkforceData = async () => {
    setLoading(true);
    try {
      if (activeTab === "incentives") {
        const res = await fetch(`/api/specialists/performance?store_id=${activeStore}`);
        const data = await res.json();
        setPerformance(data);
      } else if (activeTab === "timeclock") {
        const res = await fetch(`/api/specialists/time-logs?store_id=${activeStore}`);
        const data = await res.json();
        setTimeLogs(data);
      } else if (activeTab === "schedules") {
        const res = await fetch(`/api/specialists/schedules?store_id=${activeStore}`);
        const data = await res.json();
        setSchedules(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePunchClock = async (e) => {
    e.preventDefault();
    if (!clockEmpId) return;
    try {
      const res = await fetch("/api/specialists/time-clock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: parseInt(clockEmpId, 10),
          store_id: activeStore,
          action: clockAction,
          notes: clockNotes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Punch clock failed");
      setClockMsg({ success: true, text: data.message });
      setClockNotes("");
      loadWorkforceData();
      setTimeout(() => setClockMsg(null), 3000);
    } catch (err) {
      setClockMsg({ success: false, text: err.message });
    }
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    if (!shiftEmpId) return;
    try {
      await fetch("/api/specialists/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: parseInt(shiftEmpId, 10),
          store_id: activeStore,
          shift_date: shiftDate,
          shift_start: shiftStart,
          shift_end: shiftEnd,
          role_duty: shiftRole
        })
      });
      setIsNewShiftOpen(false);
      loadWorkforceData();
    } catch (err) {
      console.error(err);
    }
  };

  const currentStoreSpecialists = employees.filter(e => e.store_id === activeStore);

  return (
    <div className="space-y-6">
      {/* Top Header & Store Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              Retail Workforce & Operations
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Specialist Operations Suite</h1>
          <p className="text-xs text-zinc-400">
            AppleCare+ attach rate tracking, digital shift punch clock, and genius technical certifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeStore}
            onChange={(e) => setActiveStore(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-white font-medium text-xs focus:outline-none focus:border-white/30"
          >
            {stores.map((s) => (
              <option key={s.store_id} value={s.store_id} className="bg-zinc-900">
                {s.name} ({s.store_id})
              </option>
            ))}
          </select>
          <button
            onClick={loadWorkforceData}
            className="btn-apple-secondary p-2.5 rounded-xl text-zinc-300 hover:text-white"
            title="Refresh Workforce Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-xs">
        <button
          onClick={() => setActiveTab("incentives")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === "incentives"
              ? "bg-white text-black font-semibold shadow-sm"
              : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Incentives & Attach Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab("timeclock")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === "timeclock"
              ? "bg-white text-black font-semibold shadow-sm"
              : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Specialist Time Clock</span>
        </button>

        <button
          onClick={() => setActiveTab("schedules")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            activeTab === "schedules"
              ? "bg-white text-black font-semibold shadow-sm"
              : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Shift Roster & Scheduling</span>
        </button>
      </div>

      {/* Tab 1: Incentives & Attach Leaderboard */}
      {activeTab === "incentives" && (
        <div className="space-y-4">
          <div className="glass-panel sheen-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">AppleCare+ Attach & Sales Leaderboard</h2>
                <p className="text-xs text-zinc-400">Ranked by total retail production and ecosystem attach ratios.</p>
              </div>
              <span className="text-xs font-mono text-zinc-500">{performance.length} Specialists</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Specialist</th>
                    <th className="pb-3 font-semibold">Badge</th>
                    <th className="pb-3 font-semibold">Role & Skills</th>
                    <th className="pb-3 font-semibold">Hardware</th>
                    <th className="pb-3 font-semibold">AppleCare+</th>
                    <th className="pb-3 font-semibold">Attach Rate</th>
                    <th className="pb-3 font-semibold text-right">Revenue</th>
                    <th className="pb-3 font-semibold text-right">Achievement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {performance.map((spec, idx) => (
                    <tr key={spec.employee_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-sans font-medium text-white flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          idx === 0 ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                          idx === 1 ? "bg-zinc-400/20 text-zinc-300 border border-zinc-400/40" :
                          idx === 2 ? "bg-amber-700/20 text-amber-600 border border-amber-700/40" :
                          "bg-zinc-900 text-zinc-500"
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{spec.specialist_name}</span>
                      </td>
                      <td className="py-3 text-zinc-400 text-[11px]">{spec.badge_number}</td>
                      <td className="py-3 font-sans text-zinc-300 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400">
                          {spec.role}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-300">{spec.hardware_units}</td>
                      <td className="py-3 text-blue-400 font-semibold">{spec.applecare_units}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${spec.attach_rate_pct >= 35 ? "text-emerald-400" : "text-amber-400"}`}>
                            {spec.attach_rate_pct}%
                          </span>
                          <div className="w-16 bg-zinc-800 h-1 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${spec.attach_rate_pct >= 35 ? "bg-emerald-400" : "bg-amber-400"}`}
                              style={{ width: `${spec.attach_rate_pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-bold text-white">
                        ${spec.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          spec.achievement_badge === "AppleCare Champion"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : spec.achievement_badge === "Flagship Top Gun"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                        }`}>
                          {spec.achievement_badge}
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

      {/* Tab 2: Specialist Time Clock */}
      {activeTab === "timeclock" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Digital Punch Console */}
          <div className="glass-panel sheen-card p-6 rounded-2xl space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Specialist Punch Console
              </h2>
              <p className="text-xs text-zinc-400">Punch in, break toggle, and shift clock-out.</p>
            </div>

            <form onSubmit={handlePunchClock} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Select Specialist</label>
                <select
                  required
                  value={clockEmpId}
                  onChange={(e) => setClockEmpId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white/30"
                >
                  <option value="">-- Choose Specialist --</option>
                  {currentStoreSpecialists.map((e) => (
                    <option key={e.employee_id} value={e.employee_id} className="bg-zinc-900">
                      {e.name} ({e.badge_number}) - {e.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Punch Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setClockAction("clock_in")}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${
                      clockAction === "clock_in"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px]">Clock In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClockAction("break")}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${
                      clockAction === "break"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    <Coffee className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px]">Break (15m)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClockAction("clock_out")}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${
                      clockAction === "clock_out"
                        ? "bg-red-500/20 text-red-300 border-red-500/40 font-semibold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-[11px]">Clock Out</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Optional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Scheduled Morning Shift"
                  value={clockNotes}
                  onChange={(e) => setClockNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30"
                />
              </div>

              {clockMsg && (
                <div className={`p-3 rounded-xl border text-xs ${
                  clockMsg.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {clockMsg.text}
                </div>
              )}

              <button
                type="submit"
                className="btn-apple-primary w-full py-2.5 rounded-xl text-black font-semibold text-xs"
              >
                Submit Punch Entry
              </button>
            </form>
          </div>

          {/* Today's Punch Logs Table */}
          <div className="lg:col-span-2 glass-panel sheen-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Active Shifts & Punch Logs</h2>
                <p className="text-xs text-zinc-400">Live specialist floor presence for today.</p>
              </div>
              <span className="text-xs font-mono text-zinc-500">{timeLogs.length} logs recorded</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Specialist</th>
                    <th className="pb-3 font-semibold">Badge</th>
                    <th className="pb-3 font-semibold">Clock In</th>
                    <th className="pb-3 font-semibold">Clock Out</th>
                    <th className="pb-3 font-semibold">Break</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {timeLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-zinc-500 font-sans">
                        No punch logs recorded yet today. Specialists can clock in using the console.
                      </td>
                    </tr>
                  ) : (
                    timeLogs.map((log) => (
                      <tr key={log.log_id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 font-sans font-medium text-white">{log.employee_name}</td>
                        <td className="py-3 text-zinc-400 text-[11px]">{log.badge_number}</td>
                        <td className="py-3 text-zinc-300">
                          {new Date(log.clock_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-3 text-zinc-400">
                          {log.clock_out
                            ? new Date(log.clock_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "— Active"}
                        </td>
                        <td className="py-3 text-zinc-400">{log.break_minutes} min</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            log.status === "Clocked In"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : log.status === "On Break"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {log.status}
                          </span>
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

      {/* Tab 3: Shift Roster & Scheduling */}
      {activeTab === "schedules" && (
        <div className="space-y-4">
          <div className="glass-panel sheen-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Weekly Specialist Shift Roster</h2>
                <p className="text-xs text-zinc-400">Operational duty assignments and coverage allocation.</p>
              </div>
              <button
                onClick={() => setIsNewShiftOpen(true)}
                className="btn-apple-primary px-3.5 py-2 rounded-xl text-black font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Shift</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Specialist</th>
                    <th className="pb-3 font-semibold">Badge</th>
                    <th className="pb-3 font-semibold">Shift Date</th>
                    <th className="pb-3 font-semibold">Hours</th>
                    <th className="pb-3 font-semibold">Operational Duty</th>
                    <th className="pb-3 font-semibold">Certifications</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {schedules.map((shift) => (
                    <tr key={shift.schedule_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-sans font-medium text-white">{shift.employee_name}</td>
                      <td className="py-3 text-zinc-400 text-[11px]">{shift.badge_number}</td>
                      <td className="py-3 text-zinc-300">{new Date(shift.shift_date).toLocaleDateString()}</td>
                      <td className="py-3 text-white font-medium">{shift.shift_start} – {shift.shift_end}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {shift.role_duty}
                        </span>
                      </td>
                      <td className="py-3 font-sans">
                        <span className="text-[10px] text-zinc-400 truncate max-w-[150px] block">
                          {Array.isArray(shift.certifications) ? shift.certifications[0] : "Certified"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Shift Modal */}
          {isNewShiftOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn text-zinc-100">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white">Schedule Specialist Shift</h2>
                    <p className="text-xs text-zinc-400">Assign duty role and working hours.</p>
                  </div>
                  <button onClick={() => setIsNewShiftOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateShift} className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Specialist</label>
                    <select
                      required
                      value={shiftEmpId}
                      onChange={(e) => setShiftEmpId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white/30"
                    >
                      <option value="">-- Choose Specialist --</option>
                      {currentStoreSpecialists.map((e) => (
                        <option key={e.employee_id} value={e.employee_id} className="bg-zinc-900">
                          {e.name} ({e.badge_number})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Shift Date</label>
                    <input
                      type="date"
                      required
                      value={shiftDate}
                      onChange={(e) => setShiftDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        required
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        required
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Duty Assignment</label>
                    <select
                      value={shiftRole}
                      onChange={(e) => setShiftRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white/30"
                    >
                      <option value="Specialist POS">Specialist POS</option>
                      <option value="Genius Bar Lead">Genius Bar Lead</option>
                      <option value="Today at Apple Trainer">Today at Apple Trainer</option>
                      <option value="Inventory Logistics">Inventory Logistics</option>
                      <option value="Store Concierge">Store Concierge</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNewShiftOpen(false)}
                      className="btn-apple-secondary px-4 py-2 rounded-xl text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-apple-primary px-5 py-2 rounded-xl text-black font-semibold"
                    >
                      Save Shift
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SpecialistWorkforceView;
