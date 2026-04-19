function createAlert({
  id,
  title,
  severity = "medium",
  status = "new",
  source = "Correlation Engine",
  confidence = 70,
  entity = "Unknown",
  description,
  recommendedAction,
}) {
  return {
    id,
    title,
    severity,
    status,
    source,
    confidence,
    entity,
    description,
    recommendedAction,
    createdAt: new Date().toLocaleString(),
  };
}

function getTopEntityLabel(nodes = []) {
  const sorted = [...nodes].sort(
    (a, b) => (b.data?.riskScore || 0) - (a.data?.riskScore || 0),
  );

  const top = sorted[0];
  return top?.data?.labelText || top?.data?.label || top?.id || "Unknown";
}

export function buildSimulatedAlerts({
  correlationFindings = [],
  nodes = [],
  graphInsights = {},
}) {
  const alerts = [];

  const topEntity = getTopEntityLabel(nodes);

  correlationFindings.forEach((finding, index) => {
    alerts.push(
      createAlert({
        id: `alert-correlation-${finding.id}-${index}`,
        title: finding.title,
        severity: finding.severity || "medium",
        status: index === 0 ? "new" : "triage",
        source: "Correlation Engine",
        confidence: finding.confidence || 70,
        entity: topEntity,
        description: finding.summary,
        recommendedAction: finding.recommendedAction,
      }),
    );
  });

  if ((graphInsights?.highRiskCount || 0) >= 2) {
    alerts.push(
      createAlert({
        id: "alert-high-risk-cluster",
        title: "High-risk entity cluster observed",
        severity: "high",
        status: "new",
        source: "Graph Analytics",
        confidence: 82,
        entity: topEntity,
        description: `${graphInsights.highRiskCount} high-risk entities are currently visible in the investigation graph.`,
        recommendedAction:
          "Validate whether the entities are operationally linked and escalate if infrastructure overlap is confirmed.",
      }),
    );
  }

  if ((graphInsights?.exposedServices || 0) >= 2) {
    alerts.push(
      createAlert({
        id: "alert-exposed-services",
        title: "Multiple exposed services detected",
        severity: "medium",
        status: "triage",
        source: "Attack Surface Analytics",
        confidence: 76,
        entity: topEntity,
        description: `${graphInsights.exposedServices} service indicators are visible in the current scope.`,
        recommendedAction:
          "Review service exposure and versioning, then confirm whether any node belongs to suspicious infrastructure.",
      }),
    );
  }

  return alerts
    .sort((a, b) => {
      const severityWeight = { high: 3, medium: 2, low: 1 };
      const sevDiff =
        (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);

      if (sevDiff !== 0) return sevDiff;
      return (b.confidence || 0) - (a.confidence || 0);
    })
    .slice(0, 6);
}
