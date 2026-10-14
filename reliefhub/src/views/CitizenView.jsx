import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  LifeBuoy, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  Home, 
  PlusCircle, 
  Truck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { UrgencyBadge, StatusBadge } from '../components/StatusBadge';

const CATEGORY_ICONS = {
  Water: Droplets,
  Food: Utensils,
  Medicine: HeartPulse,
  Shelter: Home,
  Rescue: LifeBuoy
};

export default function CitizenView({ requests, onRequestClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = requests.filter(r => 
    !searchTerm || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    r.contact.includes(searchTerm.trim())
  );

  return (
    <div className="space-y-6">
      
      {/* Hero Banner with Emergency Action */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Citizen Emergency Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Need Immediate Emergency Supplies?
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Submit your emergency requirements in under 30 seconds. Your request will be instantly prioritized and matched with nearby volunteer relief depots.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onRequestClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Emergency Request</span>
            </button>
            <span className="text-xs text-emerald-300 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AI Multilingual SOS Intake Active (Hindi / English / Hinglish)
            </span>
          </div>
        </div>
      </div>

      {/* Request Lookup Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Track by Request ID (e.g. REQ-001) or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 self-end sm:self-auto">
          Tracking {filtered.length} active tickets
        </span>
      </div>

      {/* Citizen Ticket Tracker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((req) => {
          const Icon = CATEGORY_ICONS[req.category] || LifeBuoy;
          const allocated = req.allocatedQuantity || 0;
          const total = req.quantity || 1;
          const remaining = Math.max(0, total - allocated);

          return (
            <div 
              key={req.id} 
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Ticket Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{req.category} Relief</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                      <span>ID: {req.id}</span>
                      <span>•</span>
                      <span>{req.location}</span>
                    </div>
                  </div>
                </div>

                <UrgencyBadge urgency={req.urgency} />
              </div>

              {/* Progress Stepper */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 my-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Dispatch Lifecycle Tracker
                </span>
                <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold">
                  
                  {/* Step 1: Pending */}
                  <div className={`p-1.5 rounded-lg border ${
                    req.status === 'Pending' 
                      ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    1. Triaged
                  </div>

                  {/* Step 2: Matched */}
                  <div className={`p-1.5 rounded-lg border ${
                    req.status === 'Matched'
                      ? 'bg-purple-600 text-white border-purple-600 font-bold'
                      : ['In Progress', 'Resolved'].includes(req.status)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    2. Matched
                  </div>

                  {/* Step 3: In Progress */}
                  <div className={`p-1.5 rounded-lg border ${
                    req.status === 'In Progress'
                      ? 'bg-sky-600 text-white border-sky-600 font-bold'
                      : req.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    3. En Route
                  </div>

                  {/* Step 4: Resolved */}
                  <div className={`p-1.5 rounded-lg border ${
                    req.status === 'Resolved'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    4. Received
                  </div>

                </div>
              </div>

              {/* Need Details */}
              <p className="text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 mb-3">
                {req.details || 'Emergency supplies required immediately.'}
              </p>

              {/* Fulfillment Metrics */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  Allocated: <strong className="text-emerald-700">{allocated}</strong> of {total} units
                </span>
                <StatusBadge status={req.status} />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
