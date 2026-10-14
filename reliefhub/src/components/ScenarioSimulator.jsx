import React from 'react';
import { Zap, Waves, Plane, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ScenarioSimulator({ onInjectRequests, onInjectResources, onBatchApprove, pendingMatchesCount }) {
  const handleFloodScenario = () => {
    const timestamp = Date.now();
    const newRequests = [
      {
        id: `REQ-SIM-${timestamp}-1`,
        category: 'Water',
        quantity: 35,
        allocatedQuantity: 0,
        details: '⚠️ FLASH FLOOD: Drinking water depleted for 12 elderly residents stranded in community hall.',
        urgency: 'Critical',
        location: 'Sector A — Gandhi Nagar',
        contact: '+91 98110 91101',
        status: 'Pending',
        assignedResourceId: null,
        createdAt: new Date().toISOString()
      },
      {
        id: `REQ-SIM-${timestamp}-2`,
        category: 'Rescue',
        quantity: 2,
        allocatedQuantity: 0,
        details: '⚠️ FLOOD SURGE: Inflatable motorboats required to evacuate flooded clinic near riverbank.',
        urgency: 'Critical',
        location: 'Sector 04 — Yamuna Riverfront',
        contact: '+91 98110 91102',
        status: 'Pending',
        assignedResourceId: null,
        createdAt: new Date().toISOString()
      }
    ];

    onInjectRequests(newRequests);
  };

  const handleSupplyDrop = () => {
    const timestamp = Date.now();
    const newResources = [
      {
        id: `RES-SIM-${timestamp}-1`,
        volunteerName: 'Tata Relief Task Force & SDRF',
        category: 'Water',
        totalQuantity: 60,
        availableQuantity: 60,
        location: 'Sector A — Gandhi Nagar',
        contact: '+91 98765 88220',
        availability: 'Available',
        createdAt: new Date().toISOString()
      },
      {
        id: `RES-SIM-${timestamp}-2`,
        volunteerName: 'NDRF 8th Battalion Rescue Unit',
        category: 'Rescue',
        totalQuantity: 4,
        availableQuantity: 4,
        location: 'Sector 04 — Yamuna Riverfront',
        contact: '+91 98765 88330',
        availability: 'Available',
        createdAt: new Date().toISOString()
      }
    ];

    onInjectResources(newResources);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-xl shadow-xs text-white mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        
        {/* Operational Testbed Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
                Disaster Triage & Operational Drill Lab
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE DRILL SYSTEM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Inject multi-casualty flood surges & test automated air-drop allocations in real time
            </p>
          </div>
        </div>

        {/* Tactical Injection Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          
          <button
            onClick={handleFloodScenario}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer border border-rose-500"
            title="Simulate sudden influx of Critical Water and Rescue requests"
          >
            <Waves className="w-3.5 h-3.5" />
            <span>+ Simulate Flash Flood</span>
          </button>

          <button
            onClick={handleSupplyDrop}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer border border-emerald-500"
            title="Inject emergency relief batch from Tata Relief and NDRF"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>+ Inject Supply Drop</span>
          </button>

          {pendingMatchesCount > 0 && (
            <button
              onClick={onBatchApprove}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer border border-indigo-400"
              title="Approve all currently pending algorithmic matches"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Auto-Dispatch All ({pendingMatchesCount})</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
