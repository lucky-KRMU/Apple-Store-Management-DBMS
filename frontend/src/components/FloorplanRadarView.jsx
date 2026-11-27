import React, { useState, useEffect } from "react";
import Users from "lucide-react/dist/esm/icons/users.js";
import Smartphone from "lucide-react/dist/esm/icons/smartphone.js";
import Laptop from "lucide-react/dist/esm/icons/laptop.js";
import Glasses from "lucide-react/dist/esm/icons/glasses.js";
import Watch from "lucide-react/dist/esm/icons/watch.js";
import Wrench from "lucide-react/dist/esm/icons/wrench.js";
import Sparkles from "lucide-react/dist/esm/icons/sparkles.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw.js";
import UserCheck from "lucide-react/dist/esm/icons/user-check.js";
import XCircle from "lucide-react/dist/esm/icons/x-circle.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import Clock from "lucide-react/dist/esm/icons/clock.js";

export function FloorplanRadarView({ stores, selectedStoreId }) {
  const [activeStore, setActiveStore] = useState(selectedStoreId || "ST-1");
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [customerNameInput, setCustomerNameInput] = useState("");
  const [specialistNameInput, setSpecialistNameInput] = useState("");
  const [occupancyInput, setOccupancyInput] = useState(2);
  const [filterZone, setFilterZone] = useState("All");

  useEffect(() => {
    fetchZones();
  }, [activeStore]);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/floorplan/zones?store_id=${activeStore}`);
      const data = await res.json();
      setZones(data);
    } catch (e) {
      console.error("Failed to load store zones", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatCustomer = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    try {
      await fetch(`/api/floorplan/zones/${selectedTable.table_id}/seat`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerNameInput.trim() || "Walk-in Guest",
          specialist_name: specialistNameInput.trim() || "Assigned Specialist",
          occupancy: parseInt(occupancyInput, 10) || 1,
          status: "Occupied"
        })
      });
      setIsSeatModalOpen(false);
      setCustomerNameInput("");
      setSpecialistNameInput("");
      setSelectedTable(null);
      fetchZones();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReleaseTable = async (tableId) => {
    try {
      await fetch(`/api/floorplan/zones/${tableId}/release`, {
        method: "PUT"
      });
      fetchZones();
    } catch (err) {
      console.error(err);
    }
  };

  const getZoneIcon = (zoneType) => {
    switch (zoneType) {
      case "iPhone Avenue":
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case "Mac Showcase":
        return <Laptop className="w-4 h-4 text-purple-400" />;
      case "Vision Pro Demo Bay":
        return <Glasses className="w-4 h-4 text-indigo-400" />;
      case "Wearables Hub":
        return <Watch className="w-4 h-4 text-amber-400" />;
      case "Genius Bar Bench":
        return <Wrench className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-pink-400" />;
    }
  };

  const filteredZones = filterZone === "All" 
    ? zones 
    : zones.filter(z => z.zone_type === filterZone);

  const totalCapacity = zones.reduce((acc, z) => acc + (z.capacity || 0), 0);
  const totalOccupancy = zones.reduce((acc, z) => acc + (z.current_occupancy || 0), 0);
  const storeOccupancyPct = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
  const activeAppointments = zones.filter(z => z.status === "Appointment In-Progress").length;

  return (
    <div className="space-y-6">
      {/* Top Header & Store Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Live Retail Seating Radar
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">Interactive Store Floorplan</h1>
          <p className="text-xs text-zinc-400">
            Real-time table occupancy, customer seating allocations, and Genius Bar bench dispatch.
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
            onClick={fetchZones}
            className="btn-apple-secondary p-2.5 rounded-xl text-zinc-300 hover:text-white"
            title="Refresh Radar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Sheen Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card sheen-card p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Live Store Density</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{storeOccupancyPct}%</span>
            <span className="text-xs text-zinc-400">capacity</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                storeOccupancyPct > 80 ? "bg-red-400" : storeOccupancyPct > 50 ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{ width: `${storeOccupancyPct}%` }}
            />
          </div>
        </div>

        <div className="glass-card sheen-card p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Seated Guests</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{totalOccupancy}</span>
            <span className="text-xs text-zinc-500 font-mono">/ {totalCapacity} spots</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 font-mono">Real-time Beacon Radar</p>
        </div>

        <div className="glass-card sheen-card p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Genius Consultations</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-400">{activeAppointments}</span>
            <span className="text-xs text-zinc-400">benches active</span>
          </div>
          <p className="text-[11px] text-emerald-400/80 mt-2 font-mono">100% Specialist Coverage</p>
        </div>

        <div className="glass-card sheen-card p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Available Tables</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-blue-400">
              {zones.filter(z => z.status === "Available").length}
            </span>
            <span className="text-xs text-zinc-400">ready to seat</span>
          </div>
          <p className="text-[11px] text-blue-400/80 mt-2 font-mono">Instant Guest Concierge</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["All", "iPhone Avenue", "Mac Showcase", "Vision Pro Demo Bay", "Wearables Hub", "Genius Bar Bench", "Today at Apple Forum"].map((z) => (
          <button
            key={z}
            onClick={() => setFilterZone(z)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterZone === z
                ? "bg-white text-black font-semibold shadow-sm"
                : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Interactive Retail Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone) => {
          const isFull = zone.current_occupancy >= zone.capacity;
          const isAvailable = zone.status === "Available" || zone.current_occupancy === 0;

          return (
            <div
              key={zone.table_id}
              className={`glass-card sheen-card rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isAvailable
                  ? "border-emerald-500/30 hover:border-emerald-400/60"
                  : zone.status === "Appointment In-Progress"
                  ? "border-indigo-500/40 hover:border-indigo-400/70"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                      {getZoneIcon(zone.zone_type)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                        {zone.zone_type}
                      </span>
                      <h3 className="font-semibold text-white text-xs truncate mt-0.5">{zone.table_label}</h3>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                      isAvailable
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : zone.status === "Appointment In-Progress"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>

                {/* Seating Progress Pill */}
                <div className="space-y-1.5 my-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      Occupancy: {zone.current_occupancy} / {zone.capacity}
                    </span>
                    <span className="text-zinc-300 font-mono font-medium">
                      {Math.round((zone.current_occupancy / zone.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? "bg-red-400" : isAvailable ? "bg-emerald-400" : "bg-blue-400"
                      }`}
                      style={{ width: `${Math.min(100, (zone.current_occupancy / zone.capacity) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Active Customer & Specialist Badge */}
                {zone.active_customer_name ? (
                  <div className="space-y-1.5 text-xs text-zinc-300 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Seated Guest:</span>
                      <span className="font-medium text-white truncate max-w-[140px]">
                        {zone.active_customer_name}
                      </span>
                    </div>
                    {zone.assigned_specialist_name && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">Specialist:</span>
                        <span className="text-blue-400 font-medium truncate max-w-[140px]">
                          {zone.assigned_specialist_name}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 py-1 font-mono">Ready for walk-in or reservation assignment.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                {isAvailable ? (
                  <button
                    onClick={() => {
                      setSelectedTable(zone);
                      setIsSeatModalOpen(true);
                    }}
                    className="btn-apple-primary w-full py-2 rounded-xl text-black font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Seat Customer</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedTable(zone);
                        setIsSeatModalOpen(true);
                      }}
                      className="btn-apple-secondary flex-1 py-1.5 rounded-xl text-zinc-300 hover:text-white text-xs"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleReleaseTable(zone.table_id)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Vacate and Clean"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Seat Customer Modal */}
      {isSeatModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md overflow-hidden text-zinc-100">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-1">
                {getZoneIcon(selectedTable.zone_type)}
                <span>{selectedTable.table_label}</span>
              </div>
              <h2 className="text-lg font-semibold text-white">Seat Guest or Start Session</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Assign customer party and primary Apple Specialist.</p>
            </div>

            <form onSubmit={handleSeatCustomer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Customer / Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Gallagher"
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Assigned Specialist</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={specialistNameInput}
                  onChange={(e) => setSpecialistNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Party Size / Occupancy</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTable.capacity}
                  value={occupancyInput}
                  onChange={(e) => setOccupancyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-white/30 text-xs"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Maximum table capacity: {selectedTable.capacity} guests</span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsSeatModalOpen(false)}
                  className="btn-apple-secondary px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-apple-primary px-5 py-2 rounded-xl text-black font-semibold"
                >
                  Confirm Seating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FloorplanRadarView;
