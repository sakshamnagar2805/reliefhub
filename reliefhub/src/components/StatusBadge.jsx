import React from 'react';
import { AlertTriangle, AlertCircle, Clock, CheckCircle2, Cpu, Truck } from 'lucide-react';

export function UrgencyBadge({ urgency }) {
  switch (urgency) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-600 text-white shadow-xs border border-rose-700">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          CRITICAL
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-900 border border-amber-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          HIGH PRIORITY
        </span>
      );
    case 'Normal':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          STANDARD
        </span>
      );
  }
}

export function StatusBadge({ status }) {
  switch (status) {
    case 'Matched':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
          <Cpu className="w-3 h-3 text-indigo-600" />
          ALLOCATED
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-300">
          <Truck className="w-3 h-3 text-sky-600" />
          EN ROUTE
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          FULFILLED
        </span>
      );
    case 'Pending':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-300">
          <Clock className="w-3 h-3 text-slate-500" />
          QUEUED
        </span>
      );
  }
}
