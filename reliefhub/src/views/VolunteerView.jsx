import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Package, 
  MapPin, 
  Phone, 
  PlusCircle, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  Home, 
  LifeBuoy, 
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';

const CATEGORY_ICONS = {
  Water: Droplets,
  Food: Utensils,
  Medicine: HeartPulse,
  Shelter: Home,
  Rescue: LifeBuoy
};

export default function VolunteerView({ resources, onResourceClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Category Aggregates
  const categoryTotals = resources.reduce((acc, res) => {
    const cat = res.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (res.availableQuantity || 0);
    return acc;
  }, {});

  const totalAvailable = resources.reduce((sum, res) => sum + (res.availableQuantity || 0), 0);
  const totalOriginal = resources.reduce((sum, res) => sum + (res.totalQuantity || 0), 0);
  const totalAllocated = totalOriginal - totalAvailable;

  const filtered = resources.filter(res =>
    !searchTerm ||
    res.volunteerName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    res.location.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    res.category.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      
      {/* Volunteer Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Volunteer Relief Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Register Supplies & Support Crisis Zones
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Every bottle of water, meal kit, or medical kit registered is routed via the deterministic matching engine directly to vetted emergency requests in real time.
          </p>
        </div>

        <button
          onClick={onResourceClick}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Supplies</span>
        </button>
      </div>

      {/* Depot Inventory Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {['Water', 'Food', 'Medicine', 'Shelter', 'Rescue'].map(cat => {
          const Icon = CATEGORY_ICONS[cat] || Package;
          const units = categoryTotals[cat] || 0;

          return (
            <div key={cat} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{cat}</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {units} <span className="text-xs font-normal text-slate-500">units</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Volunteer Supplier Cards List */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search donor / location / category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {filtered.length} active supplier depots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(res => {
            const Icon = CATEGORY_ICONS[res.category] || Package;
            const isExhausted = res.availableQuantity <= 0;

            return (
              <div 
                key={res.id} 
                className={`p-4 rounded-xl border transition-all ${
                  isExhausted ? 'bg-slate-50 opacity-75 border-slate-200' : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{res.volunteerName}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{res.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isExhausted
                      ? 'bg-slate-100 text-slate-600 border-slate-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {isExhausted ? 'Exhausted' : 'Active'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 my-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Stock Remaining</span>
                  <span className="font-extrabold text-slate-900">
                    {res.availableQuantity} / {res.totalQuantity} units
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{res.contact}</span>
                  </div>
                  <span className="text-slate-400">{res.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
