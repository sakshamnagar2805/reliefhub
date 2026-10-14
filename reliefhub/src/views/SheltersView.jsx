import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  PlusCircle, 
  ShieldAlert, 
  Zap, 
  Droplets, 
  HeartPulse, 
  Flame,
  ArrowRight
} from 'lucide-react';

const INITIAL_SHELTERS = [
  {
    id: 'SHELTER-01',
    name: 'Rajiv Gandhi Indoor Sports Stadium',
    location: 'Sector A — Gandhi Nagar',
    totalBeds: 150,
    occupiedBeds: 124,
    status: 'Available',
    manager: 'Col. Vikramaditya Rathore (NDRF)',
    contact: '+91 98101 00100',
    amenities: ['Solar Power Backup', 'RO Clean Water', 'Red Cross Medical Bay', 'Langar Seva Kitchen'],
    urgentNeed: '30 Woolen Blankets & Baby Nutrition Kits'
  },
  {
    id: 'SHELTER-02',
    name: 'Kendriya Vidyalaya Relief Shelter',
    location: 'Sector 04 — Yamuna Riverfront',
    totalBeds: 90,
    occupiedBeds: 86,
    status: 'Near Capacity',
    manager: 'Pooja Deshmukh (Civil Defense)',
    contact: '+91 98220 11223',
    amenities: ['Clean Water Tankers', 'Community Canteen', 'Primary Health Station'],
    urgentNeed: 'Inflatable Rescue Cots & Water Purification Tablets'
  },
  {
    id: 'SHELTER-03',
    name: 'Gurdwara Sri Guru Singh Sabha Seva Sadan',
    location: 'Sector B — Subhash Chowk',
    totalBeds: 80,
    occupiedBeds: 62,
    status: 'Available',
    manager: 'Harpreet Singh (Gurdwara Prabandhak)',
    contact: '+91 97654 32109',
    amenities: ['24x7 Langar Food Facility', 'Power Inverters', 'Packaged RO Water'],
    urgentNeed: 'Dry Ration Bags & Sanitary Hygiene Packs'
  },
  {
    id: 'SHELTER-04',
    name: 'Pragati Disaster Relief Logistics Depot',
    location: 'Sector C — Industrial Area Depot',
    totalBeds: 200,
    occupiedBeds: 75,
    status: 'Available',
    manager: 'Anand Verma (District Relief Officer)',
    contact: '+91 98450 99887',
    amenities: ['Diesel Generator Grid', 'Helipad Access', 'Army Mobile Hospital', 'Deep Borewell Water'],
    urgentNeed: 'Thermal Tarpaulins & Solar Lanterns'
  }
];

export default function SheltersView({ onRouteSupplies }) {
  const [shelters, setShelters] = useState(INITIAL_SHELTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Near Capacity' | 'Available'

  const totalCapacity = shelters.reduce((sum, s) => sum + s.totalBeds, 0);
  const totalOccupied = shelters.reduce((sum, s) => sum + s.occupiedBeds, 0);
  const overallOccupancy = Math.round((totalOccupied / totalCapacity) * 100);

  const filtered = shelters.filter(s => {
    const matchesSearch = 
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      s.urgentNeed.toLowerCase().includes(searchTerm.toLowerCase().trim());

    if (!matchesSearch) return false;
    if (statusFilter === 'Near Capacity') return s.status === 'Near Capacity';
    if (statusFilter === 'Available') return s.status === 'Available';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold mb-3">
            <Home className="w-3.5 h-3.5" />
            <span>National Disaster Management Shelter Directory • Operational Grid</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Evacuation Camps & Shelter Capacity
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Monitor live bed occupancy, on-site emergency utilities, and route incoming volunteer supplies directly to camps facing critical supply shortages.
          </p>
        </div>

        {/* Global Occupancy Gauge Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-xl text-center min-w-[200px] shrink-0 shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Grid Shelter Occupancy
          </span>
          <div className="text-3xl font-black tracking-tight text-white my-1">
            {overallOccupancy}%
          </div>
          <div className="text-xs text-indigo-300 font-semibold">
            {totalOccupied} of {totalCapacity} Beds Filled
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                overallOccupancy > 85 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${overallOccupancy}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search shelter, location, or shortage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold self-stretch sm:self-auto">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              statusFilter === 'All' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            All Camps ({shelters.length})
          </button>
          <button
            onClick={() => setStatusFilter('Near Capacity')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              statusFilter === 'Near Capacity' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Near Capacity ({shelters.filter(s => s.status === 'Near Capacity').length})
          </button>
          <button
            onClick={() => setStatusFilter('Available')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              statusFilter === 'Available' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Available Capacity ({shelters.filter(s => s.status === 'Available').length})
          </button>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(shelter => {
          const occupancyRate = Math.round((shelter.occupiedBeds / shelter.totalBeds) * 100);
          const isNearCapacity = occupancyRate >= 90;

          return (
            <div 
              key={shelter.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                isNearCapacity ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isNearCapacity ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">
                        {shelter.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{shelter.location}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isNearCapacity
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {shelter.status}
                  </span>
                </div>

                {/* Occupancy Bar */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-600">Bed Occupancy:</span>
                    <span className="font-bold text-slate-900">
                      {shelter.occupiedBeds} / {shelter.totalBeds} beds ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        occupancyRate >= 90 ? 'bg-rose-500' : occupancyRate >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* On-Site Amenities Chips */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Active Utilities & Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {shelter.amenities.map(am => (
                      <span 
                        key={am}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{am}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Urgent Shortage Notice */}
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Critical Shortage: <strong>{shelter.urgentNeed}</strong></span>
                </div>

              </div>

              {/* Footer Details */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{shelter.contact}</span>
                </div>
                <span className="font-medium text-slate-600">{shelter.manager}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
