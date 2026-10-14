import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  HeartHandshake, 
  User, 
  CheckCircle2, 
  Lock, 
  Phone, 
  Building2, 
  MapPin, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

const DEMO_PERSONAS = [
  {
    role: 'dispatcher',
    title: 'Crisis Dispatcher',
    name: 'Col. Vikramaditya Rathore',
    contact: 'DISPATCH-NDRF-04',
    organization: 'National Disaster Response Force (NDRF)',
    location: 'Sector 04 Flood Command Center',
    badge: 'Commander Level'
  },
  {
    role: 'supplier',
    title: 'Relief Supplier / NGO',
    name: 'Sunita Sharma',
    contact: '+91 98765 43210',
    organization: 'Goonj Relief Foundation',
    location: 'Gandhi Nagar Relief Depot',
    badge: 'Verified Supplier'
  },
  {
    role: 'citizen',
    title: 'Citizen Requester',
    name: 'Ramesh Patel & Family',
    contact: '+91 98201 10101',
    organization: 'Local Resident',
    location: 'Gandhi Nagar — Ward 12',
    badge: 'Urgent Citizen'
  }
];

export default function LoginModal({ isOpen, onClose, onLogin, currentUser }) {
  const [activeTab, setActiveTab] = useState('dispatcher'); // 'dispatcher' | 'supplier' | 'citizen'
  
  // Custom Form fields
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLogin({
      role: activeTab,
      name: name.trim(),
      contact: contact.trim() || '+91 98000 00000',
      organization: organization.trim() || (activeTab === 'supplier' ? 'Independent Donor' : 'Citizen'),
      location: location.trim() || 'Sector A — Gandhi Nagar'
    });
    onClose();
  };

  const handleQuickPersona = (persona) => {
    onLogin(persona);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                ReliefHub Identity Portal
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Select your role or enter credentials to sign in
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Persona Switcher (Judge Presentation Shortcut) */}
        <div className="my-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            1-Click Pitch Demo Personas
          </span>

          <div className="grid grid-cols-3 gap-2">
            {DEMO_PERSONAS.map((persona) => {
              const isCurrent = currentUser?.role === persona.role && currentUser?.name === persona.name;
              return (
                <button
                  key={persona.role}
                  type="button"
                  onClick={() => handleQuickPersona(persona)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[72px] ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tight truncate w-full text-blue-600">
                    {persona.role}
                  </span>
                  <span className="text-xs font-bold truncate w-full leading-tight">
                    {persona.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    1-Click
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-bold text-[10px]">Or Sign In With Details</span>
          </div>
        </div>

        {/* Role Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('dispatcher')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'dispatcher' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dispatcher
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('supplier')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'supplier' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Supplier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('citizen')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'citizen' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Citizen
          </button>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              {activeTab === 'supplier' ? 'Supplier / Org Name *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={activeTab === 'dispatcher' ? 'e.g. Col. Vikramaditya Rathore' : activeTab === 'supplier' ? 'e.g. Goonj Relief Foundation' : 'e.g. Ramesh Patel'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Location Sector
              </label>
              <input
                type="text"
                placeholder="Sector A — Gandhi Nagar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Sign In as {activeTab.toUpperCase()}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
