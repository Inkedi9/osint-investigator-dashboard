function averageRiskScore(nodes = []) {
  if (!nodes.length) return 0;
  const total = nodes.reduce(
    (sum, node) => sum + (node.data?.riskScore || 0),
    0,
  );
  return Math.round(total / nodes.length);
}

function getThreatCategory(nodes = []) {
  const types = nodes.map((node) => node.data?.type);

  if (types.includes("email") && types.includes("domain")) {
    return "Phishing Infrastructure";
  }

  if (types.includes("service") && types.includes("ip")) {
    return "Exposed Infrastructure";
  }

  if (types.includes("username") && types.includes("email")) {
    return "Identity-Linked Activity";
  }

  return "General OSINT Investigation";
}

function getConfidence(nodes = [], pivotTrail = [], discoveredPivotIds = []) {
  let score = 40;

  if (nodes.length >= 4) score += 10;
  if (nodes.length >= 8) score += 10;
  if (pivotTrail.length >= 2) score += 10;
  if (discoveredPivotIds.length >= 1) score += 10;
  if (averageRiskScore(nodes) >= 70) score += 10;

  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

export function buildAiAnalystAssessment({
  nodes = [],
  pivotTrail = [],
  discoveredPivotIds = [],
  graphInsights = {},
  isCaseMode = false,
  caseTitle = null,
}) {
  const avgRisk = averageRiskScore(nodes);
  const category = getThreatCategory(nodes);
  const confidence = getConfidence(nodes, pivotTrail, discoveredPivotIds);

  const summary = isCaseMode
    ? `AI analyst assessment indicates ${category.toLowerCase()} patterns within investigation "${caseTitle || "current case"}". The visible graph contains ${graphInsights.totalNodes || nodes.length} entities with an average risk score of ${avgRisk}. ${graphInsights.highRiskCount || 0} high-risk indicators are currently in scope.`
    : `AI analyst assessment indicates ${category.toLowerCase()} patterns across the visible graph. The current workspace contains ${graphInsights.totalNodes || nodes.length} entities with an average risk score of ${avgRisk}. ${graphInsights.highRiskCount || 0} high-risk indicators are currently visible.`;

  const suggestions = [];

  if ((graphInsights.highRiskCount || 0) > 0) {
    suggestions.push(
      "Validate the highest-risk entities first and confirm whether they represent active malicious infrastructure.",
    );
  }

  if ((graphInsights.exposedServices || 0) > 0) {
    suggestions.push(
      "Review exposed services and correlate them with related IP and domain infrastructure.",
    );
  }

  if ((graphInsights.riskyEmails || 0) > 0) {
    suggestions.push(
      "Investigate suspicious email-linked indicators for phishing or credential harvesting overlap.",
    );
  }

  if (discoveredPivotIds.length > 0) {
    suggestions.push(
      "Review newly discovered pivots and determine whether they should be added to the formal investigation scope.",
    );
  }

  if (pivotTrail.length >= 2) {
    suggestions.push(
      "Continue graph-based pivoting along the current investigation trail to confirm infrastructure relationships.",
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Collect additional pivots and expand the graph to improve confidence in the current assessment.",
    );
  }

  const posture =
    avgRisk >= 80
      ? "Critical"
      : avgRisk >= 65
        ? "Elevated"
        : avgRisk >= 45
          ? "Moderate"
          : "Low";

  return {
    summary,
    suggestions,
    confidence,
    posture,
    avgRisk,
    category,
  };
}
