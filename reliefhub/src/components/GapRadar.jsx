import React from 'react';
import { AlertCircle, CheckCircle2, Droplets, Utensils, HeartPulse, Home, LifeBuoy, Activity } from 'lucide-react';

const CATEGORIES = [
  { name: 'Water', icon: Droplets, unit: 'L / Jars' },
  { name: 'Food', icon: Utensils, unit: 'Packs' },
  { name: 'Medicine', icon: HeartPulse, unit: 'Kits' },
  { name: 'Shelter', icon: Home, unit: 'Cots' },
  { name: 'Rescue', icon: LifeBuoy, unit: 'Boats' }
];

export default function GapRadar({ requests, resources }) {
  // 1. Calculate active unfulfilled demand per category
  const demandByCat = requests.reduce((acc, req) => {
    if (req.status === 'Resolved') return acc;
    const remaining = (req.quantity || 0) - (req.allocatedQuantity || 0);
    acc[req.category] = (acc[req.category] || 0) + Math.max(0, remaining);
    return acc;
  }, {});

  // 2. Calculate available supply per category
  const supplyByCat = resources.reduce((acc, res) => {
    if (res.availability !== 'Available') return acc;
    acc[res.category] = (acc[res.category] || 0) + (Number(res.availableQuantity) || 0);
    return acc;
  }, {});

  // 3. Compute net balance
  const gaps = CATEGORIES.map(cat => {
    const demand = demandByCat[cat.name] || 0;
    const supply = supplyByCat[cat.name] || 0;
    const net = supply - demand;
    const hasShortage = net < 0;
    return {
      ...cat,
      demand,
      supply,
      net,
      hasShortage,
      deficit: Math.abs(net)
    };
  });

  const totalShortages = gaps.filter(g => g.hasShortage).length;

  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs mb-6 select-none">
      
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-900 text-blue-400 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Need-to-Resource Gap Radar
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            • Live Stock vs. Distress Demand Balance
          </span>
        </div>

        {totalShortages > 0 ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
            {totalShortages} {totalShortages === 1 ? 'Category Shortage' : 'Categories with Deficits'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            All Needs Fully Stocked
          </span>
        )}
      </div>

      {/* 5-Column Compact Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {gaps.map((item) => {
          const Icon = item.icon;
          const isShort = item.hasShortage;

          return (
            <div
              key={item.name}
              className={`p-2 rounded-lg border text-xs transition-all ${
                isShort
                  ? 'bg-rose-50/60 border-rose-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1 text-[11px]">
                  <Icon className={`w-3 h-3 ${isShort ? 'text-rose-600' : 'text-slate-500'}`} />
                  {item.name}
                </span>

                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  isShort
                    ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {isShort ? `-${item.deficit}` : `+${item.net}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Need: <strong className="text-slate-800">{item.demand}</strong></span>
                <span>Stock: <strong className={isShort ? 'text-rose-700' : 'text-emerald-700'}>{item.supply}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
