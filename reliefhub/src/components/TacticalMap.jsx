import React from 'react';
import { MapPin, Navigation, Shield, AlertTriangle, Package, Radio, Filter, RotateCcw } from 'lucide-react';

const SECTORS = [
  { id: 'Sector A', name: 'Sector A — Gandhi Nagar', x: 22, y: 35, width: 34, height: 42, risk: 'High', desc: 'Dense residential colony • Flood water logging 1.2m' },
  { id: 'Sector B', name: 'Sector B — Subhash Chowk', x: 60, y: 20, width: 34, height: 35, risk: 'Medium', desc: 'Commercial market hub • Relief camp established' },
  { id: 'Sector C', name: 'Sector C — Industrial Area Depot', x: 58, y: 58, width: 36, height: 38, risk: 'Low', desc: 'Central warehousing & logistics runway' },
  { id: 'Sector 04', name: 'Sector 04 — Yamuna Riverfront', x: 22, y: 5, width: 36, height: 26, risk: 'Critical', desc: 'River cresting • NDRF motorboat evacuation active' }
];

export default function TacticalMap({ requests, resources, selectedSector, onSelectSector }) {
  // Aggregate stats per sector
  const getSectorStats = (sectorId) => {
    const sectorReqs = requests.filter(r => 
      r.location && r.location.toLowerCase().includes(sectorId.toLowerCase())
    );
    const sectorRes = resources.filter(res => 
      res.location && res.location.toLowerCase().includes(sectorId.toLowerCase())
    );

    const critical = sectorReqs.filter(r => r.urgency === 'Critical' && r.status !== 'Resolved').length;
    const pending = sectorReqs.filter(r => r.status !== 'Resolved').length;
    const supplyUnits = sectorRes.reduce((sum, res) => sum + (res.availableQuantity || 0), 0);

    return { critical, pending, supplyUnits };
  };

  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-white shadow-md relative overflow-hidden">
      
      {/* Tactical Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              Tactical Crisis Sector Grid
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
              NAVIC 28.6139° N, 77.2090° E
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any sector to dynamically filter triage queues and available inventory
          </p>
        </div>

        {selectedSector && (
          <button
            onClick={() => onSelectSector('')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Map Filter ({selectedSector})</span>
          </button>
        )}
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full aspect-[16/9] min-h-[280px] sm:min-h-[320px] bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden select-none">
        
        {/* Radar Scanning Line Animation */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none animate-pulse"></div>

        {/* River Water Hazard Graphic */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 0,32 Q 35,42 65,28 T 100,38 L 100,48 Q 65,38 35,52 T 0,42 Z" fill="#0284c7" />
          <path d="M 0,35 Q 35,45 65,31 T 100,41" stroke="#38bdf8" strokeWidth="0.8" fill="none" strokeDasharray="2,2" />
        </svg>

        {/* Sector Interactive Quadrants */}
        {SECTORS.map(sec => {
          const stats = getSectorStats(sec.id);
          const isSelected = selectedSector.toLowerCase() === sec.id.toLowerCase();
          const hasCritical = stats.critical > 0;

          return (
            <div
              key={sec.id}
              onClick={() => onSelectSector(isSelected ? '' : sec.id)}
              style={{
                left: `${sec.x}%`,
                top: `${sec.y}%`,
                width: `${sec.width}%`,
                height: `${sec.height}%`
              }}
              className={`absolute rounded-xl border p-2.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                  : hasCritical
                  ? 'bg-rose-950/40 hover:bg-rose-900/50 border-rose-500/50 hover:border-rose-400'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-500'
              }`}
            >
              {/* Sector Title & Ping */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold tracking-tight ${
                  isSelected ? 'text-blue-300' : hasCritical ? 'text-rose-300' : 'text-slate-300'
                }`}>
                  {sec.id}
                </span>

                {hasCritical ? (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                )}
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {stats.pending > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                    hasCritical 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                    {stats.pending} Needs
                  </span>
                )}

                {stats.supplyUnits > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {stats.supplyUnits} Staged
                  </span>
                )}
              </div>

              {/* Bottom Sector Tag */}
              <div className="text-[9px] text-slate-400 truncate mt-1">
                {sec.desc}
              </div>

            </div>
          );
        })}

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-semibold flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Critical Emergency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Volunteer Depot</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400">
            <span>〰 River Hazard</span>
          </div>
        </div>

      </div>

    </div>
  );
}
