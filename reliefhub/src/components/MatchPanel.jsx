import React, { useState } from 'react';
import { Cpu, Check, X, Target, MapPin, ArrowRight, ShieldCheck, SlidersHorizontal, Plus, Minus } from 'lucide-react';
import { UrgencyBadge } from './StatusBadge';

export default function MatchPanel({ recommendations, onApprove, onDismiss }) {
  // Coordinator Human-in-the-Loop Quantity Overrides State
  const [customQuantities, setCustomQuantities] = useState({});

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-300">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2 border border-slate-200">
          <Cpu className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">RescuePulse™ Engine Idle</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          All active emergency demands have confirmed coordinator allocation plans or await supply replenishment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((match) => {
        const { request, resource, suggestedQuantity, isSameLocality, reason } = match;
        const requestedRemaining = request.quantity - (request.allocatedQuantity || 0);

        // Coordinator modified allocation (default to algorithmic suggested quantity)
        const currentQty = customQuantities[match.id] !== undefined 
          ? customQuantities[match.id] 
          : suggestedQuantity;

        const maxAvailableForThis = Math.min(requestedRemaining, resource.availableQuantity);
        const postDepotStock = Math.max(0, resource.availableQuantity - currentQty);
        const remainingCitizenNeed = Math.max(0, requestedRemaining - currentQty);

        const handleAdjustQty = (delta) => {
          const next = Math.max(1, Math.min(maxAvailableForThis, currentQty + delta));
          setCustomQuantities(prev => ({ ...prev, [match.id]: next }));
        };

        return (
          <div
            key={match.id}
            className="bg-white rounded-xl p-4 border border-slate-300 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Top Operational Classification Bar */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  RescuePulse™ Plan
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isSameLocality
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  <Target className="w-3 h-3" />
                  <span className="truncate max-w-[130px]">{reason}</span>
                </span>
              </div>

              <UrgencyBadge urgency={request.urgency} />
            </div>

            {/* Need <-> Supply Comparison Grid */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2.5 text-xs">
              
              {/* Left: Citizen Need */}
              <div>
                <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">
                  Target Distress Ticket
                </span>
                <span className="font-bold text-slate-900 block text-xs mt-0.5">
                  {request.category} ({requestedRemaining} units)
                </span>
                <div className="flex items-center gap-1 text-slate-600 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate text-[11px]">{request.location}</span>
                </div>
              </div>

              {/* Right: Available Supply */}
              <div className="border-l border-slate-200 pl-2.5">
                <span className="font-semibold text-slate-500 block uppercase tracking-wider text-[9px]">
                  Assigned Volunteer Depot
                </span>
                <span className="font-bold text-slate-900 block text-xs mt-0.5 truncate">
                  {resource.volunteerName}
                </span>
                <div className="flex items-center gap-1 text-slate-600 mt-0.5">
                  <span className="font-semibold text-emerald-700 text-[11px]">{resource.availableQuantity} in depot</span>
                  <span className="text-slate-400 text-[11px] truncate">• {resource.location}</span>
                </div>
              </div>

            </div>

            {/* Human-in-the-Loop Coordinator Stepper & Recalculation */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-tight flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-indigo-600" />
                  Coordinator Quantity:
                </span>
                
                {/* Stepper Controls */}
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-md p-0.5">
                  <button
                    type="button"
                    onClick={() => handleAdjustQty(-5)}
                    disabled={currentQty <= 1}
                    className="w-5 h-5 rounded hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Decrease allocation by 5"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="px-2 font-bold text-xs text-indigo-700 min-w-[28px] text-center">
                    {currentQty}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAdjustQty(5)}
                    disabled={currentQty >= maxAvailableForThis}
                    className="w-5 h-5 rounded hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Increase allocation by 5"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between border-t border-slate-200/60 pt-1">
                <span>
                  Depot Post-Dispatch: <strong className="text-slate-700">{postDepotStock}</strong> left
                </span>
                <span className="font-bold text-emerald-700">
                  {remainingCitizenNeed > 0 
                    ? `Pending: ${remainingCitizenNeed} units` 
                    : '✓ 100% Fulfilled'}
                </span>
              </div>
            </div>

            {/* Actions: Approve / Dismiss */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onApprove(match, currentQty)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Plan ({currentQty} Units)</span>
              </button>

              <button
                onClick={() => onDismiss(match.id)}
                className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
                title="Dismiss recommendation from view"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
