import React from 'react';
import { MapPin, Phone, Droplets, Utensils, HeartPulse, Home, LifeBuoy, Package } from 'lucide-react';

const CATEGORY_ICONS = {
  Water: Droplets,
  Food: Utensils,
  Medicine: HeartPulse,
  Shelter: Home,
  Rescue: LifeBuoy
};

export default function ResourceList({ resources }) {
  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-300">
        <p className="text-sm font-semibold text-slate-500">No volunteer supplies match active filters.</p>
        <p className="text-xs text-slate-400 mt-1">Register new supplies using the button above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map((res) => {
        const IconComponent = CATEGORY_ICONS[res.category] || Package;
        const isExhausted = res.availability === 'Exhausted' || res.availableQuantity <= 0;

        return (
          <div
            key={res.id}
            className={`bg-white rounded-xl p-4 border transition-all duration-150 shadow-xs hover:shadow-md ${
              isExhausted ? 'opacity-70 bg-slate-50/60 border-slate-200' : 'border-slate-200'
            }`}
          >
            {/* Header: Volunteer Name + Status */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isExhausted ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {res.volunteerName}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{res.location}</span>
                  </div>
                </div>
              </div>

              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                isExhausted
                  ? 'bg-slate-100 text-slate-600 border-slate-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {isExhausted ? 'Exhausted' : 'Available'}
              </span>
            </div>

            {/* Quantity Metrics */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Stock Remaining</span>
                <span className="text-base font-extrabold text-slate-900">
                  {res.availableQuantity} <span className="text-xs font-normal text-slate-500">/ {res.totalQuantity} units</span>
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {res.category}
              </span>
            </div>

            {/* Footer Contact */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{res.contact}</span>
              </div>
              <span className="text-slate-400">{res.id}</span>
            </div>

          </div>
        );
      })}
    </div>
  );
}
