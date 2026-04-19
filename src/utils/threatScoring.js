function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getThreatLevel(score) {
  if (score >= 85) {
    return {
      label: "Critical",
      tone: "border-red-500/30 bg-red-500/10 text-red-300",
    };
  }

  if (score >= 70) {
    return {
      label: "High",
      tone: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    };
  }

  if (score >= 45) {
    return {
      label: "Moderate",
      tone: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    };
  }

  return {
    label: "Low",
    tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  };
}

export function buildThreatScore({
  nodes = [],
  edges = [],
  graphInsights = {},
  correlationFindings = [],
  simulatedAlerts = [],
  pivotTrail = [],
  isCaseMode = false,
}) {
  const highRiskNodes = nodes.filter(
    (node) => (node.data?.riskScore || 0) >= 80,
  ).length;
  const mediumRiskNodes = nodes.filter((node) => {
    const score = node.data?.riskScore || 0;
    return score >= 60 && score < 80;
  }).length;

  const serviceNodes = nodes.filter(
    (node) => node.data?.type === "service",
  ).length;
  const emailNodes = nodes.filter((node) => node.data?.type === "email").length;
  const ipNodes = nodes.filter((node) => node.data?.type === "ip").length;

  const highSeverityCorrelations = correlationFindings.filter(
    (item) => item.severity === "high",
  ).length;

  const highSeverityAlerts = simulatedAlerts.filter(
    (item) => item.severity === "high",
  ).length;

  let score = 0;
  const factors = [];

  score += highRiskNodes * 12;
  if (highRiskNodes > 0) {
    factors.push(`${highRiskNodes} high-risk node(s)`);
  }

  score += mediumRiskNodes * 6;
  if (mediumRiskNodes > 0) {
    factors.push(`${mediumRiskNodes} medium-risk node(s)`);
  }

  score += Math.min(serviceNodes * 4, 16);
  if (serviceNodes > 0) {
    factors.push(`${serviceNodes} service indicator(s)`);
  }

  score += Math.min(ipNodes * 3, 12);
  if (ipNodes > 0) {
    factors.push(`${ipNodes} infrastructure IP node(s)`);
  }

  score += Math.min(emailNodes * 4, 12);
  if (emailNodes > 0) {
    factors.push(`${emailNodes} email-linked node(s)`);
  }

  score += highSeverityCorrelations * 10;
  if (highSeverityCorrelations > 0) {
    factors.push(`${highSeverityCorrelations} high-severity correlation(s)`);
  }

  score += highSeverityAlerts * 8;
  if (highSeverityAlerts > 0) {
    factors.push(`${highSeverityAlerts} high-severity alert(s)`);
  }

  score += Math.min((pivotTrail?.length || 0) * 4, 16);
  if ((pivotTrail?.length || 0) >= 2) {
    factors.push(`${pivotTrail.length} pivot step(s)`);
  }

  if ((graphInsights?.totalEdges || edges.length || 0) >= 6) {
    score += 8;
    factors.push("dense relationship graph");
  }

  if (isCaseMode) {
    score += 6;
    factors.push("active investigation context");
  }

  score = clamp(score, 0, 100);

  const level = getThreatLevel(score);

  let summary =
    "Limited risk concentration detected in the current graph scope.";

  if (score >= 85) {
    summary =
      "Critical concentration of risky indicators detected. Immediate analyst attention is recommended.";
  } else if (score >= 70) {
    summary =
      "High-confidence suspicious cluster detected with meaningful attack surface or infrastructure exposure.";
  } else if (score >= 45) {
    summary =
      "Moderate threat signals identified. Additional enrichment or pivoting may confirm malicious linkage.";
  }

  return {
    score,
    level: level.label,
    tone: level.tone,
    summary,
    factors: factors.slice(0, 6),
  };
}
