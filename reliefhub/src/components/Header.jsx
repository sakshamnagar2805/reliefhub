import React from 'react';
import { ShieldAlert, RotateCcw, PlusCircle, HeartHandshake, Menu, X, Radio, User, ChevronDown } from 'lucide-react';

export default function Header({ 
  criticalCount, 
  onResetDemo, 
  onRequestClick, 
  onResourceClick,
  isSidebarOpen,
  onToggleSidebar,
  currentUser,
  onOpenLogin
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Institutional Tricolor Ribbon */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 opacity-90"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 select-none">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shrink-0 shadow-xs border border-blue-400/30">
              <ShieldAlert className="w-5 h-5" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-slate-900"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white leading-none">
                  ReliefHub
                </h1>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  GOI • NDRF DISASTER GRID
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono leading-none mt-1 hidden sm:flex items-center gap-2">
                <span>SECTOR 04 COMMAND POST</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  NAVIC SAT-RELAY: 100% ONLINE
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Controls & Telemetry */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Critical Ticker Pill */}
          {criticalCount > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{criticalCount} Critical</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Grid Clear</span>
            </div>
          )}

          {/* User Profile / Role Switcher */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs transition-all cursor-pointer select-none"
            title="Switch User Role or Sign In"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
              currentUser?.role === 'dispatcher' 
                ? 'bg-blue-600' 
                : currentUser?.role === 'supplier' 
                ? 'bg-emerald-600' 
                : 'bg-amber-600'
            }`}>
              {currentUser?.name ? currentUser.name[0] : 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-[11px] font-bold text-slate-200 truncate max-w-[95px]">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Guest'}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 capitalize">
                {currentUser?.role || 'Login'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          <button
            onClick={onRequestClick}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Request Help</span>
          </button>

          <button
            onClick={onResourceClick}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offer Supplies</span>
          </button>

          <button
            onClick={onResetDemo}
            title="Reset Demo Data"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Reset</span>
          </button>

        </div>

      </div>
    </header>
  );
}
