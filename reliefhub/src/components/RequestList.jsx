import React from 'react';
import { UrgencyBadge, StatusBadge } from './StatusBadge';
import { MapPin, Phone, Droplets, Utensils, HeartPulse, Home, LifeBuoy, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

const CATEGORY_ICONS = {
  Water: Droplets,
  Food: Utensils,
  Medicine: HeartPulse,
  Shelter: Home,
  Rescue: LifeBuoy
};

export default function RequestList({ requests, onStatusChange, onCancelMatch }) {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-300">
        <p className="text-sm font-semibold text-slate-500">No emergency requests match active filters.</p>
        <p className="text-xs text-slate-400 mt-1">Adjust filters or submit a new citizen request.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const IconComponent = CATEGORY_ICONS[req.category] || LifeBuoy;
        const allocated = req.allocatedQuantity || 0;
        const total = req.quantity || 1;
        const remaining = Math.max(0, total - allocated);
        const percent = Math.min(100, Math.round((allocated / total) * 100));

        const isCritical = req.urgency === 'Critical';

        return (
          <div
            key={req.id}
            className={`bg-white rounded-xl p-4 border transition-all duration-150 shadow-xs hover:shadow-md ${
              isCritical
                ? 'border-t-4 border-t-rose-500 border-slate-200'
                : 'border-t-4 border-t-blue-500 border-slate-200'
            }`}
          >
            {/* Top Bar: Category + Urgency + Status */}
            <div className="flex items-start justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCritical ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{req.category}</span>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]" title={req.id}>
                      {req.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{req.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end max-w-[130px]">
                <UrgencyBadge urgency={req.urgency} />
                <StatusBadge status={req.status} />
              </div>
            </div>

            {/* Description Details */}
            {req.details && (
              <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {req.details}
              </p>
            )}

            {/* Allocation Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700">
                  Allocated: <span className="text-emerald-700 font-bold">{allocated}</span> / {total} units
                </span>
                <span className={`font-bold ${remaining > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {remaining > 0 ? `${remaining} still needed` : 'Fully Allocated'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300" 
                  style={{ width: `${percent}%` }}
                ></div>
                {remaining > 0 && (
                  <div 
                    className={`h-full ${isCritical ? 'bg-rose-400' : 'bg-amber-400'}`} 
                    style={{ width: `${100 - percent}%` }}
                  ></div>
                )}
              </div>
            </div>

            {/* Contact & Dispatcher Controls Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{req.contact}</span>
              </div>

              {/* Status Action Buttons for Dispatcher */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                {req.status === 'Matched' && (
                  <>
                    <button
                      onClick={() => onStatusChange(req.id, 'In Progress')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span>Dispatch Now</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    {onCancelMatch && (
                      <button
                        onClick={() => onCancelMatch(req)}
                        title="Cancel Match & Revert Stock"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-xs transition-all cursor-pointer"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    )}
                  </>
                )}

                {req.status === 'In Progress' && (
                  <button
                    onClick={() => onStatusChange(req.id, 'Resolved')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Confirm Resolved</span>
                  </button>
                )}

                {req.status === 'Resolved' && (
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Closed & Delivered
                  </span>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
