import React from 'react';
import { 
  ShieldAlert, 
  Home, 
  Truck, 
  FileText, 
  HeartHandshake, 
  BarChart3, 
  PlusCircle, 
  Radio
} from 'lucide-react';

export default function Sidebar({ 
  activeView, 
  onViewChange, 
  onRequestClick, 
  onResourceClick, 
  criticalCount,
  activeDispatchesCount,
  isOpen,
  onClose
}) {
  const navItems = [
    { 
      id: 'dispatcher', 
      label: 'Dispatcher Command', 
      icon: ShieldAlert, 
      badge: criticalCount > 0 ? `${criticalCount} Crit` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    { 
      id: 'shelters', 
      label: 'Evacuation Shelters', 
      icon: Home,
      badge: '4 Camps',
      badgeColor: 'bg-indigo-600 text-white'
    },
    { 
      id: 'assignments', 
      label: 'Logistics & Delivery', 
      icon: Truck,
      badge: activeDispatchesCount > 0 ? `${activeDispatchesCount} Active` : null,
      badgeColor: 'bg-sky-500 text-white'
    },
    { 
      id: 'citizen', 
      label: 'Citizen Request Tracker', 
      icon: FileText,
      badge: null
    },
    { 
      id: 'volunteer', 
      label: 'Volunteer Workspace', 
      icon: HeartHandshake,
      badge: null
    },
    { 
      id: 'pulse', 
      label: 'Gap Radar & Analytics', 
      icon: BarChart3,
      badge: 'Radar',
      badgeColor: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-4 px-3 shadow-xl transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Operational Nav Section */}
        <div className="space-y-4">
          
          {/* Sector Badge */}
          <div className="px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Sector Protocol
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              SEC-04 LIVE
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 block mb-1">
              Operational Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 block mb-1">
              Emergency Actions
            </span>

            <button
              onClick={() => {
                onRequestClick();
                if (onClose) onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Broadcast Need</span>
            </button>

            <button
              onClick={() => {
                onResourceClick();
                if (onClose) onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Register Supplies</span>
            </button>
          </div>

        </div>

        {/* Bottom Status Telemetry Card */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Crisis Grid Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Ping: 12ms • Lat: 42.3601 N
          </p>
        </div>

      </aside>
    </>
  );
}
