import React from 'react';
import { ClipboardList, AlertTriangle, PackageCheck, CheckCircle2 } from 'lucide-react';

export default function MetricCards({ requests, resources }) {
  const totalRequests = requests.length;
  const criticalPending = requests.filter(
    r => r.urgency === 'Critical' && r.status !== 'Resolved'
  ).length;
  
  const totalAvailableSupplies = resources.reduce(
    (sum, res) => sum + (res.availability === 'Available' ? Number(res.availableQuantity) || 0 : 0),
    0
  );
  
  const resolvedCount = requests.filter(r => r.status === 'Resolved').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Total Requests */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Needs</span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalRequests}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {requests.filter(r => r.status === 'Pending').length} pending triage
          </span>
        </div>
      </div>

      {/* 2. Critical Requests Pending */}
      <div className={`rounded-xl p-4 sm:p-5 border transition-all ${
        criticalPending > 0
          ? 'bg-rose-50/70 border-rose-200 shadow-xs'
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            criticalPending > 0 ? 'text-rose-700 flex items-center gap-1.5' : 'text-slate-500'
          }`}>
            {criticalPending > 0 && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>}
            Critical Needs
          </span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            criticalPending > 0 ? 'bg-rose-200/80 text-rose-800' : 'bg-slate-100 text-slate-700'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            criticalPending > 0 ? 'text-rose-700' : 'text-slate-900'
          }`}>
            {criticalPending}
          </span>
          <span className={`text-xs font-medium ${
            criticalPending > 0 ? 'text-rose-600 font-semibold' : 'text-slate-500'
          }`}>
            {criticalPending > 0 ? 'Immediate action required' : 'Clear'}
          </span>
        </div>
      </div>

      {/* 3. Available Resources Units */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Available Supplies</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalAvailableSupplies}
          </span>
          <span className="text-xs font-medium text-emerald-700 font-semibold">
            {resources.filter(r => r.availability === 'Available').length} active donors
          </span>
        </div>
      </div>

      {/* 4. Resolved Requests */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Resolved Needs</span>
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {resolvedCount}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {totalRequests > 0 ? `${Math.round((resolvedCount / totalRequests) * 100)}% resolution` : '0%'}
          </span>
        </div>
      </div>

    </div>
  );
}
