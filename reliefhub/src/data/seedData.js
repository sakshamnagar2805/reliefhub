export const initialRequests = [
  {
    id: "REQ-001",
    category: "Water",
    quantity: 20,
    allocatedQuantity: 0,
    details: "Drinking water needed for trapped family of 5 near flooded residential colony",
    urgency: "Critical",
    location: "Sector A — Gandhi Nagar",
    contact: "+91 98201 10101",
    status: "Pending",
    assignedResourceId: null,
    createdAt: "2026-10-14T08:30:00.000Z"
  },
  {
    id: "REQ-002",
    category: "Food",
    quantity: 50,
    allocatedQuantity: 0,
    details: "Dry ration packs and khichdi kits needed for community camp",
    urgency: "High",
    location: "Sector B — Subhash Chowk",
    contact: "+91 98112 20202",
    status: "Pending",
    assignedResourceId: null,
    createdAt: "2026-10-14T09:15:00.000Z"
  },
  {
    id: "REQ-003",
    category: "Medicine",
    quantity: 10,
    allocatedQuantity: 0,
    details: "Insulin vials, ORS sachets, antiseptic, and sterile bandages",
    urgency: "Normal",
    location: "Sector A — Gandhi Nagar",
    contact: "+91 98334 30303",
    status: "Pending",
    assignedResourceId: null,
    createdAt: "2026-10-14T09:45:00.000Z"
  },
  {
    id: "REQ-004",
    category: "Food",
    quantity: 40,
    allocatedQuantity: 40,
    details: "Ready-to-eat meals for 25 displaced persons in government primary school",
    urgency: "High",
    location: "Sector B — Subhash Chowk",
    contact: "+91 98445 40404",
    status: "In Progress",
    assignedResourceId: "RES-002",
    createdAt: "2026-10-14T07:30:00.000Z"
  },
  {
    id: "REQ-005",
    category: "Water",
    quantity: 25,
    allocatedQuantity: 25,
    details: "20-litre RO purified water jars delivered to Sector 3 PHC clinic",
    urgency: "Critical",
    location: "Sector A — Gandhi Nagar",
    contact: "+91 98556 50505",
    status: "Resolved",
    assignedResourceId: "RES-001",
    createdAt: "2026-10-14T06:00:00.000Z"
  }
];

export const initialResources = [
  {
    id: "RES-001",
    volunteerName: "Sunita Sharma (Goonj Relief Seva)",
    category: "Water",
    totalQuantity: 55,
    availableQuantity: 30,
    location: "Sector A — Gandhi Nagar",
    contact: "+91 98765 43210",
    availability: "Available",
    createdAt: "2026-10-14T08:00:00.000Z"
  },
  {
    id: "RES-002",
    volunteerName: "Akshaya Patra Foundation Relief Hub",
    category: "Food",
    totalQuantity: 140,
    availableQuantity: 100,
    location: "Sector C — Industrial Area Depot",
    contact: "+91 98123 45678",
    availability: "Available",
    createdAt: "2026-10-14T08:15:00.000Z"
  },
  {
    id: "RES-003",
    volunteerName: "Dr. Rajesh Kulkarni (IMA Medical Corps)",
    category: "Medicine",
    totalQuantity: 15,
    availableQuantity: 15,
    location: "Sector A — Gandhi Nagar",
    contact: "+91 98987 65432",
    availability: "Available",
    createdAt: "2026-10-14T08:45:00.000Z"
  },
  {
    id: "RES-004",
    volunteerName: "Gurdwara Sri Guru Singh Sabha Langar Seva",
    category: "Food",
    totalQuantity: 60,
    availableQuantity: 45,
    location: "Sector B — Subhash Chowk",
    contact: "+91 97654 32109",
    availability: "Available",
    createdAt: "2026-10-14T08:30:00.000Z"
  }
];
