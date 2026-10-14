import React, { useState } from 'react';
import { X, HeartHandshake, Package, Droplets, Utensils, HeartPulse, Home, LifeBuoy } from 'lucide-react';

const CATEGORIES = [
  { name: 'Water', icon: Droplets },
  { name: 'Food', icon: Utensils },
  { name: 'Medicine', icon: HeartPulse },
  { name: 'Shelter', icon: Home },
  { name: 'Rescue', icon: LifeBuoy }
];

export default function ResourceForm({ isOpen, onClose, onSubmit }) {
  const [volunteerName, setVolunteerName] = useState('');
  const [category, setCategory] = useState('Water');
  const [quantity, setQuantity] = useState(25);
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsedQty = Math.max(1, parseInt(quantity, 10) || 0);

    if (!volunteerName.trim()) {
      setError('Please provide your name or organization.');
      return;
    }
    if (!location.trim()) {
      setError('Please provide the depot or current supply location.');
      return;
    }
    if (!contact.trim()) {
      setError('Please provide contact details.');
      return;
    }
    if (parsedQty <= 0) {
      setError('Available quantity must be greater than zero.');
      return;
    }

    const newResource = {
      id: `RES-${Date.now()}`,
      volunteerName: volunteerName.trim(),
      category,
      totalQuantity: parsedQty,
      availableQuantity: parsedQty,
      location: location.trim(),
      contact: contact.trim(),
      availability: 'Available',
      createdAt: new Date().toISOString()
    };

    onSubmit(newResource);
    // Reset form
    setVolunteerName('');
    setLocation('');
    setContact('');
    setQuantity(25);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Register Relief Supplies</h2>
              <p className="text-xs text-slate-500">Provide inventory details for immediate dispatcher allocation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2">
            <Package className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Volunteer / Org Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Volunteer Name / Relief Organization *
            </label>
            <input
              type="text"
              placeholder="e.g. Sunita Sharma (Goonj) or Akshaya Patra Relief Hub"
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Supply Category *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map(({ name, icon: Icon }) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    category === name
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Available Units / Stock *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Depot / Current Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Sector A — Gandhi Nagar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Contact Phone / Logistics Coordinator *
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-all cursor-pointer"
            >
              Register Supplies
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
