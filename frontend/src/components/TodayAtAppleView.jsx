import React, { useState, useEffect } from "react";
import Sparkles from "lucide-react/dist/esm/icons/sparkles.js";
import Calendar from "lucide-react/dist/esm/icons/calendar.js";
import Users from "lucide-react/dist/esm/icons/users.js";
import MapPin from "lucide-react/dist/esm/icons/map-pin.js";
import Clock from "lucide-react/dist/esm/icons/clock.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import { api } from "../services/api.js";

export function TodayAtAppleView({ stores, selectedStoreId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Reservation Modal
  const [selectedSessionForRsvp, setSelectedSessionForRsvp] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // New Session Modal
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Photo");
  const [newCapacity, setNewCapacity] = useState(15);
  const [newZone, setNewZone] = useState("The Forum / Video Wall");

  const categories = ["All", "Photo", "Coding & Apps", "Art & Design", "Music", "Video"];

  useEffect(() => {
    loadSessions();
  }, [selectedStoreId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await api.getSessions(selectedStoreId ? { store_id: selectedStoreId } : {});
      setSessions(data);
    } catch (err) {
      console.error("Failed to load Today at Apple sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvp = async (e) => {
    e.preventDefault();
    if (!guestName) {
      alert("Please enter customer name.");
      return;
    }

    try {
      setIsSubmittingRsvp(true);
      await api.reserveSession({
        session_id: selectedSessionForRsvp.session_id,
        customer_name: guestName,
        seats_reserved: 1,
      });
      setRsvpSuccess(true);
      setTimeout(() => {
        setSelectedSessionForRsvp(null);
        setRsvpSuccess(false);
        setGuestName("");
        setGuestEmail("");
        loadSessions();
      }, 1500);
    } catch (err) {
      alert(`RSVP failed: ${err.message}`);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!newTitle) {
      alert("Please enter a session title.");
      return;
    }

    try {
      await api.createSession({
        store_id: selectedStoreId || "ST-1",
        title: newTitle,
        category: newCategory,
        capacity: parseInt(newCapacity, 10),
        location_zone: newZone,
      });
      setIsNewSessionOpen(false);
      setNewTitle("");
      loadSessions();
    } catch (err) {
      alert(`Failed to create session: ${err.message}`);
    }
  };

  const filteredSessions =
    selectedCategory === "All"
      ? sessions
      : sessions.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Today at Apple
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> In-Store Experiences
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Free community creative workshops, coding labs, and photo walks hosted by Specialists at the Forum.
          </p>
        </div>

        <button
          onClick={() => setIsNewSessionOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-lg transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Host New Session</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "bg-white text-black shadow-md font-semibold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="py-16 text-center text-zinc-500 text-xs">Loading Today at Apple calendar...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-xs bg-[#121214] rounded-2xl border border-zinc-800">
          No sessions scheduled under this category for the current store.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSessions.map((session) => {
            const booked = parseInt(session.booked_count || 0, 10);
            const cap = parseInt(session.capacity || 15, 10);
            const pct = Math.min(100, Math.round((booked / cap) * 100));

            return (
              <div
                key={session.session_id}
                className="glass-card sheen-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-amber-500/30 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {session.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {new Date(session.session_time).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                      {session.title}
                    </h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span>{session.location_zone || "The Forum"}</span>
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
                      <Users className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span>Specialist Lead: {session.lead_specialist_name || "Apple Specialist"}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/60 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-500">Capacity Booked</span>
                      <span className="text-zinc-300 font-mono font-medium">
                        {booked} / {cap} seats ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 90 ? "bg-amber-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSessionForRsvp(session)}
                    className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Reserve Customer Seat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RSVP Modal */}
      {selectedSessionForRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">Today at Apple Reservation</h3>
              <button
                onClick={() => setSelectedSessionForRsvp(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-semibold text-white">Reservation Confirmed!</h4>
                <p className="text-xs text-zinc-400">Customer added to session attendance register.</p>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="space-y-4 text-xs">
                <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                  <p className="font-semibold text-white">{selectedSessionForRsvp.title}</p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">{selectedSessionForRsvp.location_zone}</p>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., Craig Federighi"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Email / Apple ID</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="craig@apple.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSelectedSessionForRsvp(null)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                  >
                    {isSubmittingRsvp ? "Confirming..." : "Confirm Reservation"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Host New Session Modal */}
      {isNewSessionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">Create Today at Apple Session</h3>
              <button
                onClick={() => setIsNewSessionOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Photo Walk: Low-Light Landscapes on iPhone 16 Pro"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">Creative Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                >
                  <option value="Photo">Photo</option>
                  <option value="Coding & Apps">Coding & Apps</option>
                  <option value="Art & Design">Art & Design</option>
                  <option value="Music">Music</option>
                  <option value="Video">Video</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Location Zone</label>
                  <input
                    type="text"
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewSessionOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold transition-colors"
                >
                  Publish Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodayAtAppleView;
