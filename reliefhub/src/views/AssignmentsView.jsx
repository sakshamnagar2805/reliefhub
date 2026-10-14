import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  FileSpreadsheet, 
  Package, 
  Search,
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { StatusBadge, UrgencyBadge } from '../components/StatusBadge';

export default function AssignmentsView({ requests, resources, onStatusChange, onGoToDispatcher, onBatchApprove, pendingMatchesCount }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'active' | 'resolved'
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all requests that are matched, in progress, or resolved
  const assignments = requests
    .filter(r => r.status !== 'Pending' || r.assignedResourceId)
    .map(req => {
      const assignedRes = resources.find(res => res.id === req.assignedResourceId);
      return {
        request: req,
        resource: assignedRes || {
          volunteerName: 'NDRF Quick Response Fleet / Sector Depot',
          location: req.location,
          contact: '+91 98100 00100'
        }
      };
    });

  const filtered = assignments.filter(({ request, resource }) => {
    const matchesSearch = 
      !searchTerm ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      resource.volunteerName.toLowerCase().includes(searchTerm.toLowerCase().trim());

    if (!matchesSearch) return false;

    if (filterType === 'active') {
      return request.status === 'Matched' || request.status === 'In Progress';
    }
    if (filterType === 'resolved') {
      return request.status === 'Resolved';
    }
    return true;
  });

  // Comprehensive CSV Export (Never empty — exports all manifests or all ticket operations)
  const handleExportCSV = () => {
    const targetData = assignments.length > 0 ? assignments : requests.map(r => ({
      request: r,
      resource: resources.find(res => res.id === r.assignedResourceId) || {
        volunteerName: r.assignedResourceId ? 'Assigned Volunteer' : 'Pending Allocation',
        location: r.location,
        contact: 'Awaiting'
      }
    }));

    const headers = [
      'Manifest / Ticket ID',
      'Need Category',
      'Total Requested',
      'Allocated Units',
      'Urgency Priority',
      'Destination Location',
      'Citizen Emergency Contact',
      'Assigned Depot / Supplier',
      'Supplier Contact',
      'Fulfillment Status',
      'Creation Timestamp'
    ];

    const rows = targetData.map(({ request, resource }) => [
      `"DSP-${request.id}"`,
      `"${request.category}"`,
      request.quantity || 0,
      request.allocatedQuantity || 0,
      `"${request.urgency}"`,
      `"${request.location || ''}"`,
      `"${request.contact || ''}"`,
      `"${resource.volunteerName || 'Pending'}"`,
      `"${resource.contact || ''}"`,
      `"${request.status}"`,
      `"${request.createdAt || new Date().toISOString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ReliefHub_Dispatches_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span>Fulfillment Logistics • Active Fleet Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Relief Assignments & Delivery Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track matched relief supplies en-route to affected communities and confirm physical handover.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingMatchesCount > 0 && onBatchApprove && (
            <button
              onClick={onBatchApprove}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Dispatch {pendingMatchesCount} RescuePulse Plans</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
            title="Download complete operational manifest as Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Manifest (Excel / CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search dispatch ID, location, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold self-stretch sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            All Manifests ({assignments.length})
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterType === 'active' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Active En-Route ({assignments.filter(a => ['Matched', 'In Progress'].includes(a.request.status)).length})
          </button>
          <button
            onClick={() => setFilterType('resolved')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              filterType === 'resolved' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Delivered ({assignments.filter(a => a.request.status === 'Resolved').length})
          </button>
        </div>
      </div>

      {/* Assignments Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
          <Truck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Dispatches in this View</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You currently have no assignments matching this filter. You can approve pending recommendations in Dispatcher Command or click below to view all operations.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Show All Manifests
            </button>
            {onGoToDispatcher && (
              <button
                onClick={onGoToDispatcher}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                <span>Go to Dispatcher Command</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ request, resource }) => {
            const isResolved = request.status === 'Resolved';
            const isInProgress = request.status === 'In Progress';

            return (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                        MANIFEST: DSP-{request.id.replace('REQ-', '')}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">
                        {request.category} Payload
                      </h4>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  {/* Route & Delivery Map Visual */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 mb-3 text-xs">
                    
                    {/* Origin */}
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                      <div className="truncate">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Pickup Depot</span>
                        <span className="font-semibold text-slate-800">{resource.volunteerName}</span>
                        <span className="text-slate-500 text-[11px] block">{resource.location}</span>
                      </div>
                    </div>

                    <div className="border-l-2 border-dashed border-slate-300 ml-1 h-3"></div>

                    {/* Destination */}
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></div>
                      <div className="truncate">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Delivery Target</span>
                        <span className="font-semibold text-slate-800">{request.location}</span>
                        <span className="text-slate-500 text-[11px] block font-mono">{request.contact}</span>
                      </div>
                    </div>

                  </div>

                  {/* Allocation Payload Details */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Cargo Volume:</span>
                    <span className="font-bold text-slate-900">
                      {request.allocatedQuantity} Units ({request.category})
                    </span>
                  </div>

                </div>

                {/* Dispatch Action Stepper */}
                <div className="pt-3 border-t border-slate-100 mt-2">
                  {request.status === 'Matched' && (
                    <button
                      onClick={() => onStatusChange(request.id, 'In Progress')}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch Transport Vehicle</span>
                    </button>
                  )}

                  {request.status === 'In Progress' && (
                    <button
                      onClick={() => onStatusChange(request.id, 'Resolved')}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Physical Handover</span>
                    </button>
                  )}

                  {request.status === 'Resolved' && (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Handover Confirmed & Signed</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
