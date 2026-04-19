import { mockEntities } from "../data/mockEntities";
import { mockTimeline } from "../data/mockTimeline";
import { mockGraph } from "../data/mockGraph";
import { graphExpansionMap } from "../data/graphExpansion";
import { mockCases } from "../data/mockCases";
import { loadCases } from "../utils/caseStorage";

function getStoredCases() {
  return loadCases(mockCases);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(min = 200, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function simulateLatency(min = 200, max = 500) {
  await wait(randomDelay(min, max));
}

function normalize(text) {
  return String(text || "")
    .trim()
    .toLowerCase();
}

function matchesQuery(entity, query) {
  const q = normalize(query);
  if (!q) return true;

  const haystack = [
    entity.id,
    entity.type,
    entity.value,
    entity.displayName,
    entity.country,
    entity.status,
    entity.notes,
    ...(entity.tags || []),
    ...(entity.source || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

function applyEntityFilters(entities, filters = {}) {
  let results = [...entities];

  if (filters.type) {
    results = results.filter((entity) => entity.type === filters.type);
  }

  if (filters.country) {
    results = results.filter((entity) => entity.country === filters.country);
  }

  if (filters.status) {
    results = results.filter((entity) => entity.status === filters.status);
  }

  if (typeof filters.minRiskScore === "number") {
    results = results.filter(
      (entity) => (entity.riskScore || 0) >= filters.minRiskScore,
    );
  }

  if (Array.isArray(filters.tags) && filters.tags.length > 0) {
    results = results.filter((entity) =>
      filters.tags.some((tag) => (entity.tags || []).includes(tag)),
    );
  }

  return results;
}

function sortByRiskDesc(entities) {
  return [...entities].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
}

function sortTimelineDesc(events) {
  return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function dedupeById(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function searchEntities(query, filters = {}) {
  await simulateLatency();

  const matched = mockEntities.filter((entity) => matchesQuery(entity, query));
  const filtered = applyEntityFilters(matched, filters);

  return sortByRiskDesc(filtered);
}

export async function getEntityById(id) {
  await simulateLatency();

  return mockEntities.find((entity) => entity.id === id) || null;
}

export async function getTimelineByEntity(id, options = {}) {
  await simulateLatency();

  const timelineEntry = mockTimeline.find((item) => item.entityId === id);
  let events = timelineEntry?.events || [];

  if (options.type) {
    events = events.filter((event) => event.type === options.type);
  }

  if (options.severity) {
    events = events.filter((event) => event.severity === options.severity);
  }

  if (typeof options.minConfidence === "number") {
    events = events.filter(
      (event) => (event.confidence || 0) >= options.minConfidence,
    );
  }

  return sortTimelineDesc(events);
}

export async function getRelationsByEntity(id, options = {}) {
  await simulateLatency();

  let edges = mockGraph.edges.filter(
    (edge) =>
      edge.source === id ||
      edge.target === id ||
      edge.from === id ||
      edge.to === id,
  );

  if (options.type) {
    edges = edges.filter((edge) => edge.type === options.type);
  }

  if (typeof options.minConfidence === "number") {
    edges = edges.filter(
      (edge) => (edge.confidence || 0) >= options.minConfidence,
    );
  }

  return edges;
}

export async function expandEntityGraph(id, options = {}) {
  await simulateLatency(300, 700);

  const expansion = graphExpansionMap[id];
  if (!expansion) {
    return {
      nodes: [],
      edges: [],
      depth: 0,
    };
  }

  const maxDepth = options.maxDepth ?? 2;
  const existingNodeIds = new Set(options.existingNodeIds || []);
  const existingEdgeIds = new Set(options.existingEdgeIds || []);

  if ((expansion.depth || 1) > maxDepth) {
    return {
      nodes: [],
      edges: [],
      depth: expansion.depth || 1,
    };
  }

  const nodes = dedupeById(expansion.nodes || []).filter(
    (node) => !existingNodeIds.has(node.id),
  );

  const edges = dedupeById(expansion.edges || []).filter(
    (edge) => !existingEdgeIds.has(edge.id),
  );

  return {
    nodes,
    edges,
    depth: expansion.depth || 1,
  };
}

export async function getCaseById(caseId) {
  await simulateLatency();

  const cases = getStoredCases();
  return cases.find((item) => item.id === caseId) || null;
}

export async function getEntitiesByCase(caseId, filters = {}) {
  await simulateLatency();

  const cases = getStoredCases();
  const currentCase = cases.find((item) => item.id === caseId);
  if (!currentCase) return [];

  const entities = mockEntities.filter((entity) =>
    (currentCase.entityIds || []).includes(entity.id),
  );

  return sortByRiskDesc(applyEntityFilters(entities, filters));
}

export async function listCases(filters = {}) {
  await simulateLatency();

  let cases = [...getStoredCases()];

  if (filters.status) {
    cases = cases.filter((item) => item.status === filters.status);
  }

  if (filters.priority) {
    cases = cases.filter((item) => item.priority === filters.priority);
  }

  return cases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getGraphByCase(caseId) {
  await simulateLatency();

  const cases = getStoredCases();
  const currentCase = cases.find((item) => item.id === caseId);

  if (!currentCase) {
    return { nodes: [], edges: [] };
  }

  const caseNodeIds = new Set(currentCase.entityIds || []);

  const nodes = mockGraph.nodes.filter((node) => caseNodeIds.has(node.id));
  const edges = mockGraph.edges.filter(
    (edge) => caseNodeIds.has(edge.source) && caseNodeIds.has(edge.target),
  );

  return { nodes, edges };
}

function buildAttackSurfaceDataset(domain) {
  const normalized = String(domain || "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return {
      domain: "",
      score: 0,
      summary: "No domain submitted.",
      subdomains: [],
      assets: [],
      findings: [],
      categories: {
        infrastructure: 0,
        exposure: 0,
        email: 0,
        trust: 0,
      },
    };
  }

  const isMicrosoftTheme =
    normalized.includes("microsoft") ||
    normalized.includes("office") ||
    normalized.includes("login") ||
    normalized.includes("support");

  const subdomains = isMicrosoftTheme
    ? [
        `www.${normalized}`,
        `login.${normalized}`,
        `mail.${normalized}`,
        `cdn.${normalized}`,
        `auth.${normalized}`,
      ]
    : [
        `www.${normalized}`,
        `app.${normalized}`,
        `mail.${normalized}`,
        `portal.${normalized}`,
      ];

  const assets = isMicrosoftTheme
    ? [
        {
          id: "asset_001",
          type: "ip",
          value: "185.193.88.24",
          hostname: `www.${normalized}`,
          country: "NL",
          provider: "Demo Hosting B.V.",
          ports: [80, 443, 8080],
          riskScore: 84,
        },
        {
          id: "asset_002",
          type: "ip",
          value: "91.224.92.117",
          hostname: `mail.${normalized}`,
          country: "DE",
          provider: "NordNode VPS",
          ports: [25, 80, 443],
          riskScore: 72,
        },
      ]
    : [
        {
          id: "asset_003",
          type: "ip",
          value: "198.51.100.24",
          hostname: `www.${normalized}`,
          country: "US",
          provider: "Demo Cloud",
          ports: [80, 443],
          riskScore: 46,
        },
      ];

  const findings = isMicrosoftTheme
    ? [
        {
          id: "finding_001",
          category: "exposure",
          severity: "high",
          title: "Exposed administrative web service",
          description:
            "An administrative HTTPS service appears exposed on infrastructure associated with the scanned domain.",
        },
        {
          id: "finding_002",
          category: "trust",
          severity: "high",
          title: "Lookalike branding pattern detected",
          description:
            "The domain naming convention is consistent with impersonation or brand abuse patterns.",
        },
        {
          id: "finding_003",
          category: "email",
          severity: "medium",
          title: "Mail-linked infrastructure observed",
          description:
            "Mail-related infrastructure and SMTP exposure suggest possible phishing delivery support.",
        },
        {
          id: "finding_004",
          category: "infrastructure",
          severity: "medium",
          title: "Shared hosting indicators present",
          description:
            "Multiple services and infrastructure fingerprints indicate shared or reused hosting patterns.",
        },
      ]
    : [
        {
          id: "finding_005",
          category: "infrastructure",
          severity: "low",
          title: "Public web service observed",
          description:
            "The scanned domain resolves to public web infrastructure with limited exposed services.",
        },
      ];

  const categories = findings.reduce(
    (acc, finding) => {
      acc[finding.category] = (acc[finding.category] || 0) + 1;
      return acc;
    },
    {
      infrastructure: 0,
      exposure: 0,
      email: 0,
      trust: 0,
    },
  );

  const score = isMicrosoftTheme ? 82 : 41;

  return {
    domain: normalized,
    score,
    summary: isMicrosoftTheme
      ? "The scanned domain is associated with suspicious lookalike infrastructure, exposed services, and email-linked operational indicators."
      : "The scanned domain presents a limited public attack surface with no major high-risk indicators in the current mock dataset.",
    subdomains,
    assets,
    findings,
    categories,
  };
}

export async function scanAttackSurface(domain) {
  await simulateLatency(300, 700);
  return buildAttackSurfaceDataset(domain);
}
