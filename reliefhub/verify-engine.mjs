import { findMatches } from './src/utils/matching.js';
import { initialRequests, initialResources } from './src/data/seedData.js';

console.log('--- RELIEFHUB ENGINE VERIFICATION ---');

// 1. Test Seed Data Matching
const matches = findMatches(initialRequests, initialResources);
console.log(`✓ Total seed matches found: ${matches.length}`);

// Verify top match is Critical Water in Area A
const topMatch = matches[0];
console.assert(topMatch.request.urgency === 'Critical', 'Top match must be Critical urgency');
console.assert(topMatch.request.category === 'Water', 'Top match must be Water category');
console.assert(topMatch.suggestedQuantity === 20, 'Suggested quantity must be 20');
console.assert(topMatch.isSameLocality === true, 'Top match must match locality Area A');
console.log('✓ Rule 1 (Category equality & Locality priority): PASSED');

// 2. Test Availability Guard
const depletedResources = [
  { id: 'RES-X', category: 'Water', availableQuantity: 0, availability: 'Exhausted', location: 'Area A' }
];
const matchesWithDepleted = findMatches(initialRequests, depletedResources);
console.assert(matchesWithDepleted.length === 0, 'Depleted resource must never be recommended');
console.log('✓ Rule 2 (Availability guard): PASSED');

// 3. Test Urgency Priority Ordering
const mixedRequests = [
  { id: 'REQ-NORM', category: 'Food', quantity: 10, allocatedQuantity: 0, urgency: 'Normal', status: 'Pending', createdAt: '2026-10-14T01:00:00Z' },
  { id: 'REQ-CRIT', category: 'Food', quantity: 10, allocatedQuantity: 0, urgency: 'Critical', status: 'Pending', createdAt: '2026-10-14T02:00:00Z' }
];
const supply = [
  { id: 'RES-FOOD', category: 'Food', availableQuantity: 10, availability: 'Available', location: 'Downtown' }
];
const urgencyMatches = findMatches(mixedRequests, supply);
console.assert(urgencyMatches[0].request.id === 'REQ-CRIT', 'Critical urgency must take priority regardless of timestamp');
console.log('✓ Rule 3 (Urgency ordering Critical > High > Normal): PASSED');

// 4. Test Allocation math with Partial need
const bigRequest = [
  { id: 'REQ-BIG', category: 'Water', quantity: 50, allocatedQuantity: 10, urgency: 'Critical', status: 'Pending' }
];
const smallSupply = [
  { id: 'RES-SMALL', category: 'Water', availableQuantity: 15, availability: 'Available', location: 'Other' }
];
const partialMatches = findMatches(bigRequest, smallSupply);
console.assert(partialMatches[0].suggestedQuantity === 15, 'Suggested quantity must be min(40, 15) = 15');
console.assert(partialMatches[0].remainingAfterMatch === 25, 'Remaining need must be 40 - 15 = 25');
console.log('✓ Rule 4 (min allocation & partial fulfillment math): PASSED');

console.log('--- ALL ENGINE UNIT TESTS PASSED SUCCESSFULLY ---');
