import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  Home, 
  LifeBuoy,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Water', icon: Droplets },
  { name: 'Food', icon: Utensils },
  { name: 'Medicine', icon: HeartPulse },
  { name: 'Shelter', icon: Home },
  { name: 'Rescue', icon: LifeBuoy }
];

export default function ReliefPulseView({ requests, resources }) {
  // Aggregate demand per category
  const demandByCat = requests.reduce((acc, r) => {
    const cat = r.category;
    const remaining = (r.quantity || 0) - (r.allocatedQuantity || 0);
    acc[cat] = (acc[cat] || 0) + Math.max(0, remaining);
    return acc;
  }, {});

  // Aggregate supply per category
  const supplyByCat = resources.reduce((acc, res) => {
    const cat = res.category;
    acc[cat] = (acc[cat] || 0) + (res.availableQuantity || 0);
    return acc;
  }, {});

  const criticalCount = requests.filter(r => r.urgency === 'Critical' && r.status !== 'Resolved').length;
  const highCount = requests.filter(r => r.urgency === 'High' && r.status !== 'Resolved').length;
  const normalCount = requests.filter(r => r.urgency === 'Normal' && r.status !== 'Resolved').length;
  const totalOpenNeeds = criticalCount + highCount + normalCount;

  const totalDemandUnits = Object.values(demandByCat).reduce((a, b) => a + b, 0);
  const totalSupplyUnits = Object.values(supplyByCat).reduce((a, b) => a + b, 0);

  const coverageRatio = totalDemandUnits > 0 
    ? Math.min(100, Math.round((totalSupplyUnits / totalDemandUnits) * 100)) 
    : 100;

  return (
    <div className="space-y-6">
      
      {/* Pulse Intelligence Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold mb-2">
              <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>NDRF Integrated Telemetry • Sector 04 Command</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Need-to-Resource Gap Radar Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Real-time deficit detection, supply sufficiency metrics, and regional triage readiness.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shrink-0 text-center min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Crisis Coverage Index
            </span>
            <span className={`text-3xl font-black tracking-tight ${coverageRatio >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {coverageRatio}%
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
              Supply-to-Demand Ratio
            </span>
          </div>
        </div>
      </div>

      {/* Triage Urgency Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Critical Deficit Queue</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-rose-700">{criticalCount}</div>
          <p className="text-xs text-rose-600 mt-1 font-medium">
            Immediate dispatch priority (&lt; 2h window)
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Priority Queue</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-amber-700">{highCount}</div>
          <p className="text-xs text-amber-600 mt-1 font-medium">
            Action required within 24h
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Normal Relief Queue</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-blue-700">{normalCount}</div>
          <p className="text-xs text-blue-600 mt-1 font-medium">
            Stable scheduled distribution
          </p>
        </div>

      </div>

      {/* Category Gap Breakdown Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <span>Category Supply vs. Demand Deficit Matrix</span>
        </h3>

        <div className="space-y-4">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const need = demandByCat[name] || 0;
            const supply = supplyByCat[name] || 0;
            const gap = supply - need;
            const isDeficit = gap < 0;

            const maxUnits = Math.max(1, need + supply);
            const needPercent = Math.round((need / maxUnits) * 100);
            const supplyPercent = Math.round((supply / maxUnits) * 100);

            return (
              <div key={name} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                      <span className="text-xs text-slate-500">
                        Needed: <strong className="text-slate-800">{need}</strong> units • In Stock: <strong className="text-emerald-700">{supply}</strong> units
                      </span>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                    isDeficit
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {isDeficit ? (
                      <>
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                        <span>Deficit: {Math.abs(gap)} units</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Surplus: +{gap} units</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Comparative Bar */}
                <div className="space-y-1 mt-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Demand: {need}</span>
                    <span>Available Supply: {supply}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                    <div 
                      className="bg-rose-500 h-full" 
                      style={{ width: `${Math.min(100, needPercent)}%` }}
                      title={`Need: ${need}`}
                    ></div>
                    <div 
                      className="bg-emerald-500 h-full" 
                      style={{ width: `${Math.min(100, supplyPercent)}%` }}
                      title={`Supply: ${supply}`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
