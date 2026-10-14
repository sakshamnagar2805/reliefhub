import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MetricCards from './components/MetricCards';
import TacticalMap from './components/TacticalMap';
import ScenarioSimulator from './components/ScenarioSimulator';
import RequestForm from './components/RequestForm';
import ResourceForm from './components/ResourceForm';
import RequestList from './components/RequestList';
import ResourceList from './components/ResourceList';
import MatchPanel from './components/MatchPanel';
import CitizenView from './views/CitizenView';
import VolunteerView from './views/VolunteerView';
import ReliefPulseView from './views/ReliefPulseView';
import SheltersView from './views/SheltersView';
import AssignmentsView from './views/AssignmentsView';
import LoginModal from './components/LoginModal';
import EmergencyChatbot from './components/EmergencyChatbot';
import GapRadar from './components/GapRadar';
import { findMatches } from './utils/matching';
import { loadInitialData, saveData, resetData } from './utils/storage';
import { Search, Filter, ShieldAlert, Sparkles, Cpu, Package, Users, Layers, AlertTriangle } from 'lucide-react';

export default function App() {
  // 1. Initial State from Storage
  const [data, setData] = useState(() => loadInitialData());
  const { requests, resources } = data;

  // 2. User Authentication & Identity State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('RELIEFHUB_USER');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      role: 'dispatcher',
      name: 'Col. Vikramaditya Rathore',
      contact: '+91 98101 00100',
      organization: 'National Disaster Response Force (NDRF)',
      location: 'Sector A — Gandhi Nagar Command Post'
    };
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('RELIEFHUB_USER', JSON.stringify(user));
    } catch (e) {}

    // Smart role-based routing
    if (user.role === 'citizen') {
      setActiveView('citizen');
    } else if (user.role === 'supplier') {
      setActiveView('volunteer');
    } else {
      setActiveView('dispatcher');
    }
  };

  // 3. Navigation State: 'dispatcher' | 'shelters' | 'assignments' | 'citizen' | 'volunteer' | 'pulse'
  const [activeView, setActiveView] = useState('dispatcher');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 4. Filter State for Dispatcher
  const [searchLocation, setSearchLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dismissedMatches, setDismissedMatches] = useState([]);
  
  // Mobile Tab Navigation inside Dispatcher: 'needs' | 'dispatch' | 'supplies'
  const [dispatcherTab, setDispatcherTab] = useState('dispatch');

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // 4. Persistent Sync
  useEffect(() => {
    saveData({ requests, resources });
  }, [requests, resources]);

  // 5. Reset Demo Data Handler
  const handleResetDemo = () => {
    const cleanData = resetData();
    setData(cleanData);
    setDismissedMatches([]);
    setSearchLocation('');
    setFilterCategory('All');
    setFilterUrgency('All');
    setFilterStatus('All');
  };

  // 6. Intake Handlers
  const handleCreateRequest = (newRequest) => {
    setData(prev => ({
      ...prev,
      requests: [newRequest, ...prev.requests]
    }));
  };

  const handleCreateResource = (newResource) => {
    setData(prev => ({
      ...prev,
      resources: [newResource, ...prev.resources]
    }));
  };

  // Injection Handlers for Judge Simulation Lab
  const handleInjectRequests = (newReqs) => {
    setData(prev => ({
      ...prev,
      requests: [...newReqs, ...prev.requests]
    }));
  };

  const handleInjectResources = (newRes) => {
    setData(prev => ({
      ...prev,
      resources: [...newRes, ...prev.resources]
    }));
  };

  // 7. Matching & Dispatcher State Machine
  const handleApproveMatch = (match, customQuantity) => {
    const { request, resource, suggestedQuantity } = match;
    const finalQuantity = Number(customQuantity) || Number(suggestedQuantity) || 1;

    const currentRes = resources.find(r => r.id === resource.id);
    if (!currentRes || currentRes.availableQuantity < finalQuantity) {
      alert('Allocation error: insufficient supply remaining in depot.');
      return;
    }

    setData(prev => {
      const updatedRequests = prev.requests.map(r => {
        if (r.id !== request.id) return r;
        const newAllocated = (r.allocatedQuantity || 0) + finalQuantity;
        return {
          ...r,
          allocatedQuantity: newAllocated,
          assignedResourceId: resource.id,
          status: 'Matched'
        };
      });

      const updatedResources = prev.resources.map(res => {
        if (res.id !== resource.id) return res;
        const newAvailable = Math.max(0, res.availableQuantity - finalQuantity);
        return {
          ...res,
          availableQuantity: newAvailable,
          availability: newAvailable === 0 ? 'Exhausted' : 'Available'
        };
      });

      return {
        requests: updatedRequests,
        resources: updatedResources
      };
    });

    setDismissedMatches(prev => prev.filter(id => id !== match.id));
  };

  const handleBatchApprove = () => {
    recommendations.forEach(match => {
      handleApproveMatch(match);
    });
  };

  const handleStatusChange = (requestId, newStatus) => {
    setData(prev => ({
      ...prev,
      requests: prev.requests.map(r => (r.id === requestId ? { ...r, status: newStatus } : r))
    }));
  };

  const handleCancelMatch = (request) => {
    if (!request.assignedResourceId || !request.allocatedQuantity) {
      handleStatusChange(request.id, 'Pending');
      return;
    }

    setData(prev => {
      const updatedResources = prev.resources.map(res => {
        if (res.id !== request.assignedResourceId) return res;
        const newAvailable = res.availableQuantity + request.allocatedQuantity;
        return {
          ...res,
          availableQuantity: newAvailable,
          availability: 'Available'
        };
      });

      const updatedRequests = prev.requests.map(r => {
        if (r.id !== request.id) return r;
        return {
          ...r,
          allocatedQuantity: 0,
          assignedResourceId: null,
          status: 'Pending'
        };
      });

      return {
        requests: updatedRequests,
        resources: updatedResources
      };
    });
  };

  const handleDismissMatch = (matchId) => {
    setDismissedMatches(prev => [...prev, matchId]);
  };

  // 8. Computed Recommendations
  const recommendations = useMemo(() => {
    const rawMatches = findMatches(requests, resources);
    return rawMatches.filter(m => !dismissedMatches.includes(m.id));
  }, [requests, resources, dismissedMatches]);

  // 9. Filtered Queues for Dispatcher View
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchLoc = !searchLocation || req.location.toLowerCase().includes(searchLocation.toLowerCase().trim());
      const matchCat = filterCategory === 'All' || req.category === filterCategory;
      const matchUrg = filterUrgency === 'All' || req.urgency === filterUrgency;
      const matchStat = filterStatus === 'All' || req.status === filterStatus;
      return matchLoc && matchCat && matchUrg && matchStat;
    });
  }, [requests, searchLocation, filterCategory, filterUrgency, filterStatus]);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchLoc = !searchLocation || res.location.toLowerCase().includes(searchLocation.toLowerCase().trim());
      const matchCat = filterCategory === 'All' || res.category === filterCategory;
      return matchLoc && matchCat;
    });
  }, [resources, searchLocation, filterCategory]);

  const criticalCount = useMemo(() => {
    return requests.filter(r => r.urgency === 'Critical' && r.status !== 'Resolved').length;
  }, [requests]);

  const activeDispatchesCount = useMemo(() => {
    return requests.filter(r => ['Matched', 'In Progress'].includes(r.status)).length;
  }, [requests]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* Top Fixed Header with Stitch Top Nav */}
      <Header
        criticalCount={criticalCount}
        onResetDemo={handleResetDemo}
        onRequestClick={() => setIsRequestModalOpen(true)}
        onResourceClick={() => setIsResourceModalOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      <div className="flex-1 flex">
        
        {/* Left Operational Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onRequestClick={() => setIsRequestModalOpen(true)}
          onResourceClick={() => setIsResourceModalOpen(true)}
          criticalCount={criticalCount}
          activeDispatchesCount={activeDispatchesCount}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Workspace */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* VIEW 1: DISPATCHER COMMAND CENTER */}
            {activeView === 'dispatcher' && (
              <div className="space-y-6">
                
                {/* Rapid Pitch Simulation Lab (Judge Demo Shortcut) */}
                <ScenarioSimulator
                  onInjectRequests={handleInjectRequests}
                  onInjectResources={handleInjectResources}
                  onBatchApprove={handleBatchApprove}
                  pendingMatchesCount={recommendations.length}
                />

                {/* KPI Metric Summary Strip */}
                <MetricCards requests={requests} resources={resources} />

                {/* Need-to-Resource Gap Radar (Real-Time Shortage Telemetry) */}
                <GapRadar requests={requests} resources={resources} />

                {/* Tactical Sector Map with Click-to-Filter */}
                <TacticalMap
                  requests={requests}
                  resources={resources}
                  selectedSector={searchLocation}
                  onSelectSector={setSearchLocation}
                />

                {/* Global Tactical Filter Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search neighborhood or click map above..."
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Category:</span>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All Categories</option>
                        <option value="Water">💧 Water</option>
                        <option value="Food">🍞 Food</option>
                        <option value="Medicine">💊 Medicine</option>
                        <option value="Shelter">⛺ Shelter</option>
                        <option value="Rescue">🚤 Rescue</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Urgency:</span>
                      <select
                        value={filterUrgency}
                        onChange={(e) => setFilterUrgency(e.target.value)}
                        className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All Urgencies</option>
                        <option value="Critical">🔴 Critical Only</option>
                        <option value="High">🟠 High Priority</option>
                        <option value="Normal">🔵 Normal</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Matched">Matched</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Mobile Tab Switcher (< lg screens) */}
                <div className="flex lg:hidden bg-slate-200/80 p-1 rounded-xl font-semibold text-xs">
                  <button
                    onClick={() => setDispatcherTab('needs')}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                      dispatcherTab === 'needs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Needs ({filteredRequests.length})
                  </button>
                  <button
                    onClick={() => setDispatcherTab('dispatch')}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                      dispatcherTab === 'dispatch' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Match Core ({recommendations.length})
                  </button>
                  <button
                    onClick={() => setDispatcherTab('supplies')}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                      dispatcherTab === 'supplies' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Supplies ({filteredResources.length})
                  </button>
                </div>

                {/* 3-Column Command Dashboard Grid — Completely Unified Command Decks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Column 1: Citizen Needs (Deck Container) */}
                  <section className={`w-full h-[650px] flex flex-col bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80 shadow-xs ${dispatcherTab !== 'needs' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="flex items-center justify-between h-8 shrink-0 mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Citizen Emergency Needs
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {filteredRequests.length}
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-1">
                      <RequestList
                        requests={filteredRequests}
                        onStatusChange={handleStatusChange}
                        onCancelMatch={handleCancelMatch}
                      />
                    </div>
                  </section>

                  {/* Column 2: Dispatcher Match Panel (Deck Container) */}
                  <section className={`w-full h-[650px] flex flex-col bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80 shadow-xs ${dispatcherTab !== 'dispatch' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="flex items-center justify-between h-8 shrink-0 mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          RescuePulse™ Engine
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                        {recommendations.length} {recommendations.length === 1 ? 'Proposal' : 'Proposals'}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1">
                      <MatchPanel
                        recommendations={recommendations}
                        onApprove={handleApproveMatch}
                        onDismiss={handleDismissMatch}
                      />
                    </div>
                  </section>

                  {/* Column 3: Supplies Queue (Deck Container) */}
                  <section className={`w-full h-[650px] flex flex-col bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80 shadow-xs ${dispatcherTab !== 'supplies' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="flex items-center justify-between h-8 shrink-0 mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Available Supplies
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {filteredResources.length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1">
                      <ResourceList resources={filteredResources} />
                    </div>
                  </section>

                </div>

              </div>
            )}

            {/* VIEW: EVACUATION SHELTERS & CAMPS */}
            {activeView === 'shelters' && (
              <SheltersView />
            )}

            {/* VIEW: LOGISTICS & ACTIVE ASSIGNMENTS */}
            {activeView === 'assignments' && (
              <AssignmentsView
                requests={requests}
                resources={resources}
                onStatusChange={handleStatusChange}
                onGoToDispatcher={() => setActiveView('dispatcher')}
                onBatchApprove={handleBatchApprove}
                pendingMatchesCount={recommendations.length}
              />
            )}

            {/* VIEW 3: CITIZEN VIEW & REQUEST TRACKER */}
            {activeView === 'citizen' && (
              <CitizenView 
                requests={requests} 
                onRequestClick={() => setIsRequestModalOpen(true)} 
              />
            )}

            {/* VIEW 4: VOLUNTEER WORKSPACE & SUPPLIES */}
            {activeView === 'volunteer' && (
              <VolunteerView 
                resources={resources} 
                onResourceClick={() => setIsResourceModalOpen(true)} 
              />
            )}

            {/* VIEW 5: RELIEF PULSE GAP INTELLIGENCE */}
            {activeView === 'pulse' && (
              <ReliefPulseView 
                requests={requests} 
                resources={resources} 
              />
            )}

          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200 bg-white py-3.5 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="font-semibold text-slate-600">
                National Disaster Management Grid • Operational Command Console • Real-Time Humanitarian Allocation
              </p>
              <p className="text-rose-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                Official Advisory: For life-critical distress, dial 112 (National Emergency) or 1070 (NDRF Relief Helpline).
              </p>
            </div>
          </footer>

        </div>
      </div>

      {/* Intake Modals */}
      <RequestForm
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleCreateRequest}
      />

      <ResourceForm
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onSubmit={handleCreateResource}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />

      {/* 24x7 Multilingual Voice & Citizen Triage Relay */}
      <EmergencyChatbot
        onCreateRequest={handleCreateRequest}
        onNavigateView={setActiveView}
        requests={requests}
        resources={resources}
      />

    </div>
  );
}
