function createCorrelation({
  id,
  title,
  severity = "medium",
  confidence = 70,
  summary,
  evidence = [],
  recommendedAction,
  tags = [],
}) {
  return {
    id,
    title,
    severity,
    confidence,
    summary,
    evidence,
    recommendedAction,
    tags,
  };
}

function getHighRiskNodes(nodes = []) {
  return nodes.filter((node) => (node.data?.riskScore || 0) >= 80);
}

function getNodesByType(nodes = [], type) {
  return nodes.filter((node) => node.data?.type === type);
}

export function buildCorrelationFindings({
  nodes = [],
  edges = [],
  graphInsights = {},
  pivotTrail = [],
  isCaseMode = false,
  caseTitle = null,
}) {
  const findings = [];

  const highRiskNodes = getHighRiskNodes(nodes);
  const emailNodes = getNodesByType(nodes, "email");
  const serviceNodes = getNodesByType(nodes, "service");
  const domainNodes = getNodesByType(nodes, "domain");
  const ipNodes = getNodesByType(nodes, "ip");

  const suspiciousEmailNodes = emailNodes.filter(
    (node) => (node.data?.riskScore || 0) >= 70,
  );

  const criticalServiceNodes = serviceNodes.filter(
    (node) => (node.data?.riskScore || 0) >= 80,
  );

  const relatedEdges = edges.filter((edge) =>
    String(edge.label || "")
      .toLowerCase()
      .includes("related"),
  );

  const resolvesEdges = edges.filter((edge) =>
    String(edge.label || "")
      .toLowerCase()
      .includes("resolves"),
  );

  const hostsEdges = edges.filter((edge) =>
    String(edge.label || "")
      .toLowerCase()
      .includes("hosts"),
  );

  if (highRiskNodes.length >= 3) {
    findings.push(
      createCorrelation({
        id: "multi-high-risk-cluster",
        title: "High-risk entity cluster detected",
        severity: "high",
        confidence: 86,
        summary: `${highRiskNodes.length} high-risk entities are simultaneously visible in the current graph scope.`,
        evidence: highRiskNodes.slice(0, 5).map((node) => ({
          id: node.id,
          label: node.data?.labelText || node.data?.label || node.id,
          type: node.data?.type,
          riskScore: node.data?.riskScore || 0,
        })),
        recommendedAction:
          "Prioritize triage of the highest-risk linked indicators and validate whether they belong to the same campaign.",
        tags: ["cluster", "risk", "triage"],
      }),
    );
  }

  if (domainNodes.length > 0 && suspiciousEmailNodes.length > 0) {
    findings.push(
      createCorrelation({
        id: "domain-email-correlation",
        title: "Suspicious domain-to-email correlation",
        severity: "medium",
        confidence: 78,
        summary: `The visible graph contains ${domainNodes.length} domain indicator(s) and ${suspiciousEmailNodes.length} suspicious email-linked indicator(s).`,
        evidence: suspiciousEmailNodes.slice(0, 4).map((node) => ({
          id: node.id,
          label: node.data?.labelText || node.data?.label || node.id,
          type: node.data?.type,
          riskScore: node.data?.riskScore || 0,
        })),
        recommendedAction:
          "Review delivery infrastructure, sender patterns, and domain lookalikes for phishing or impersonation activity.",
        tags: ["email", "domain", "phishing"],
      }),
    );
  }

  if (criticalServiceNodes.length >= 2) {
    findings.push(
      createCorrelation({
        id: "exposed-services-correlation",
        title: "Multiple high-risk services exposed",
        severity: "high",
        confidence: 84,
        summary: `${criticalServiceNodes.length} exposed service indicators have elevated risk scores in the current graph.`,
        evidence: criticalServiceNodes.slice(0, 5).map((node) => ({
          id: node.id,
          label: node.data?.labelText || node.data?.label || node.id,
          type: node.data?.type,
          riskScore: node.data?.riskScore || 0,
        })),
        recommendedAction:
          "Validate service exposure, enumerate versions, and check whether the infrastructure overlaps with known suspicious assets.",
        tags: ["service", "exposure", "attack-surface"],
      }),
    );
  }

  if (resolvesEdges.length >= 2 && ipNodes.length >= 2) {
    findings.push(
      createCorrelation({
        id: "shared-infrastructure-pattern",
        title: "Shared infrastructure pattern observed",
        severity: "medium",
        confidence: 73,
        summary: `Several domain-to-IP resolution relationships suggest shared infrastructure or common hosting dependencies.`,
        evidence: resolvesEdges.slice(0, 5).map((edge) => ({
          id: edge.id,
          label: `${edge.source} → ${edge.target}`,
          type: edge.label || "relation",
        })),
        recommendedAction:
          "Validate whether the linked IPs are reused across suspicious nodes or belong to a common provider cluster.",
        tags: ["infrastructure", "shared-hosting", "pivot"],
      }),
    );
  }

  if (pivotTrail.length >= 3) {
    findings.push(
      createCorrelation({
        id: "deep-pivot-investigation",
        title: "Multi-step pivoting path identified",
        severity: "medium",
        confidence: 80,
        summary: `The investigation trail shows ${pivotTrail.length} pivot step(s), indicating meaningful graph expansion from the original scope.`,
        evidence: pivotTrail.slice(0, 6).map((item, index) => ({
          id: `pivot-${index}`,
          label: item,
          type: "pivot",
        })),
        recommendedAction:
          "Review the pivot sequence to isolate the first malicious branching point and retain the path in the case record.",
        tags: ["pivoting", "investigation", "trail"],
      }),
    );
  }

  if (
    graphInsights?.highRiskCount >= 2 &&
    graphInsights?.exposedServices >= 2
  ) {
    findings.push(
      createCorrelation({
        id: "high-risk-exposure-blend",
        title: "Risk and exposure correlation",
        severity: "high",
        confidence: 88,
        summary: `The current view combines ${graphInsights.highRiskCount} high-risk entities with ${graphInsights.exposedServices} service indicators.`,
        evidence: [
          {
            id: "metric-high-risk",
            label: `${graphInsights.highRiskCount} high-risk entities`,
            type: "metric",
          },
          {
            id: "metric-services",
            label: `${graphInsights.exposedServices} service indicators`,
            type: "metric",
          },
        ],
        recommendedAction:
          "Treat the infrastructure as potentially operational and prioritize containment or enrichment depending on case scope.",
        tags: ["risk", "exposure", "priority"],
      }),
    );
  }

  if (isCaseMode && nodes.length >= 4) {
    findings.push(
      createCorrelation({
        id: "case-scope-correlation",
        title: "Investigation scope contains actionable cluster",
        severity: "medium",
        confidence: 76,
        summary: caseTitle
          ? `The current investigation scope for "${caseTitle}" contains enough linked indicators to support a focused analyst hypothesis.`
          : "The current investigation scope contains enough linked indicators to support a focused analyst hypothesis.",
        evidence: nodes.slice(0, 5).map((node) => ({
          id: node.id,
          label: node.data?.labelText || node.data?.label || node.id,
          type: node.data?.type,
          riskScore: node.data?.riskScore || 0,
        })),
        recommendedAction:
          "Document the suspected cluster, preserve graph evidence, and decide whether the case should escalate to confirmed malicious infrastructure review.",
        tags: ["case", "scope", "analyst"],
      }),
    );
  }

  return findings.sort((a, b) => {
    const severityWeight = { high: 3, medium: 2, low: 1 };
    const diff =
      (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);

    if (diff !== 0) return diff;
    return (b.confidence || 0) - (a.confidence || 0);
  });
}
