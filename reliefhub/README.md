# 🛡️ ReliefHub — Autonomous Disaster Coordination & Dispatch System

> **Zero-latency crisis coordination platform connecting distressed citizens, verified relief suppliers, and disaster dispatchers (NDRF/SDRF) in real time.**

---

## 🌟 Key Features

1. **Dispatcher Command Center:**
   - **Symmetrical 3-Column Deck**:
     - *Column 1*: Citizen Emergency Need Intake Queue (sorted by Critical > High > Normal).
     - *Column 2*: Algorithmic Resource Match Panel (automatic greedy matching based on category, locality, and quantity).
     - *Column 3*: Staged Volunteer Inventory & Relief Depots.
   - **Tactical Crisis Sector Grid**: Interactive GPS sector mapping across Sector A (Gandhi Nagar), Sector B (Subhash Chowk), Sector C (Industrial Depot), and Sector 04 (Yamuna Riverfront).
   - **Rapid Pitch Simulation Lab**: 1-click scenario injector for judges to test flash flood distress influx and automated relief air drops live.

2. **Multi-Role Identity Portal (Personas):**
   - **Crisis Dispatcher**: `Col. Vikramaditya Rathore`, *National Disaster Response Force (NDRF)*.
   - **Relief Supplier / NGO**: `Sunita Sharma`, *Goonj Relief Foundation*.
   - **Citizen Requester**: `Ramesh Patel & Family`, *Gandhi Nagar — Ward 12*.

3. **Specialized Operational Views (Accessible via Left Navigation):**
   - **Evacuation Shelters & Camps Directory**: Real-time bed occupancy progress meters, on-site utility checklists (solar, RO water, mobile clinics), and critical shortage notices.
   - **Logistics & Delivery Manifests**: Real-time dispatch tracking with 1-click **Excel / CSV Export** of manifests and emergency tickets.
   - **Citizen Emergency Request Tracker**: 4-step progress stepper (Triaged → Matched → En Route → Received).
   - **Volunteer Supplier Workspace**: Direct supply registration and category inventory gauges.
   - **Relief Pulse Intelligence**: Aggregated demand-vs-supply ratios and category gap metrics.

4. **Architecture & Reliability:**
   - Offline-first client-side state machine using synchronized `localStorage` (`RELIEFHUB_DATA_V4`).
   - Zero external backend dependencies or heavy API token locks.
   - Fast, deterministic greedy matching algorithm (`verify-engine.mjs`).

---

## 🚀 Quickstart Guide

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

### 3. Production Build
```bash
npm run build
```
Generates the production bundle in `dist/`.
