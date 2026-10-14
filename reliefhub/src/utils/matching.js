/**
 * ReliefHub — Pure Deterministic Matching Engine
 * 
 * Rules enforced:
 * 1. Category alignment: request.category.toLowerCase() === resource.category.toLowerCase()
 * 2. Resource availability: availableQuantity > 0 and availability === 'Available'
 * 3. Priority queue: Critical > High > Normal, then chronological order
 * 4. Locality preference: Higher score if request and resource share exact location
 * 5. Suggested allocation: Math.min(remainingNeed, resource.availableQuantity)
 * 6. Pure computation: ZERO side effects, no state mutation.
 */

export function findMatches(requests, resources) {
  if (!Array.isArray(requests) || !Array.isArray(resources)) {
    return [];
  }

  // 1. Filter out resolved requests or requests with 0 remaining need
  const unresolvedRequests = requests
    .filter(req => req.status !== 'Resolved' && (req.quantity - (req.allocatedQuantity || 0)) > 0)
    .sort((a, b) => {
      const urgencyRank = { Critical: 3, High: 2, Normal: 1 };
      const rankDiff = (urgencyRank[b.urgency] || 1) - (urgencyRank[a.urgency] || 1);
      if (rankDiff !== 0) return rankDiff;
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    });

  const recommendations = [];

  for (const req of unresolvedRequests) {
    const remainingNeed = req.quantity - (req.allocatedQuantity || 0);
    if (remainingNeed <= 0) continue;

    // 2. Find eligible resources
    const candidates = resources.filter(res => 
      res.category &&
      req.category &&
      res.category.toLowerCase().trim() === req.category.toLowerCase().trim() &&
      res.availableQuantity > 0 &&
      res.availability === 'Available'
    );

    if (candidates.length === 0) continue;

    // 3. Rank candidate resources: prioritize matching location, then highest available quantity
    const sortedCandidates = [...candidates].sort((a, b) => {
      const aLocMatch = (a.location && req.location && a.location.toLowerCase().trim() === req.location.toLowerCase().trim()) ? 1 : 0;
      const bLocMatch = (b.location && req.location && b.location.toLowerCase().trim() === req.location.toLowerCase().trim()) ? 1 : 0;
      
      if (bLocMatch !== aLocMatch) {
        return bLocMatch - aLocMatch;
      }
      return b.availableQuantity - a.availableQuantity;
    });

    const bestResource = sortedCandidates[0];
    const suggestedQuantity = Math.min(remainingNeed, bestResource.availableQuantity);

    const isSameLocality = bestResource.location && req.location && 
      bestResource.location.toLowerCase().trim() === req.location.toLowerCase().trim();

    recommendations.push({
      id: `MATCH-${req.id}-${bestResource.id}`,
      request: req,
      resource: bestResource,
      suggestedQuantity,
      remainingAfterMatch: remainingNeed - suggestedQuantity,
      isSameLocality,
      reason: isSameLocality
        ? `Direct Category & Locality Match in "${req.location}"`
        : `Category Match with available inventory from "${bestResource.location}"`
    });
  }

  return recommendations;
}
