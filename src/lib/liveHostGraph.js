function slug(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]/g, "-");
}

function createNode({
  id,
  label,
  type,
  riskScore = 50,
  x = 0,
  y = 0,
  extra = {},
}) {
  return {
    id,
    position: { x, y },
    data: {
      label,
      labelText: label,
      type,
      riskScore,
      ...extra,
    },
  };
}

function createEdge({ source, target, label, confidence = 80 }) {
  return {
    id: `${label}:${source}->${target}`,
    source,
    target,
    label,
    confidence,
  };
}

export function buildLiveHostGraph(hostData) {
  if (!hostData?.ip) {
    return {
      nodes: [],
      edges: [],
      focusNodeId: null,
    };
  }

  const nodes = [];
  const edges = [];
  const nodeIds = new Set();
  const edgeIds = new Set();

  const addNode = (node) => {
    if (!nodeIds.has(node.id)) {
      nodeIds.add(node.id);
      nodes.push(node);
    }
  };

  const addEdge = (edge) => {
    if (!edgeIds.has(edge.id)) {
      edgeIds.add(edge.id);
      edges.push(edge);
    }
  };

  const ipId = `ip:${slug(hostData.ip)}`;

  addNode(
    createNode({
      id: ipId,
      label: hostData.ip,
      type: "ip",
      riskScore: hostData.riskScore || 65,
      x: 0,
      y: 0,
      extra: {
        source: "live_host",
        organization: hostData.organization,
        country: hostData.country,
        asn: hostData.asn,
      },
    }),
  );

  if (hostData.organization) {
    const orgId = `service:${slug(hostData.organization)}`;

    addNode(
      createNode({
        id: orgId,
        label: hostData.organization,
        type: "service",
        riskScore: 45,
        x: -320,
        y: -40,
        extra: {
          source: "live_host",
          category: "organization",
        },
      }),
    );

    addEdge(
      createEdge({
        source: orgId,
        target: ipId,
        label: "hosts",
        confidence: 88,
      }),
    );
  }

  (hostData.services || []).forEach((service, index) => {
    const label = `${service.product}:${service.port}`;
    const serviceId = `service:${slug(hostData.ip)}:${slug(label)}`;

    addNode(
      createNode({
        id: serviceId,
        label,
        type: "service",
        riskScore: [22, 3389, 21].includes(service.port)
          ? Math.max(hostData.riskScore || 70, 80)
          : Math.max((hostData.riskScore || 60) - 5, 45),
        x: 320,
        y: -80 + index * 120,
        extra: {
          source: "live_host",
          port: service.port,
          product: service.product,
          version: service.version,
          category: "service",
        },
      }),
    );

    addEdge(
      createEdge({
        source: ipId,
        target: serviceId,
        label: "hosts_service",
        confidence: 92,
      }),
    );
  });

  (hostData.findings || []).forEach((finding, index) => {
    const findingId = `finding:${slug(finding)}:${index}`;

    addNode(
      createNode({
        id: findingId,
        label: finding,
        type: "service",
        riskScore:
          finding.toLowerCase().includes("exposed") ||
          finding.toLowerCase().includes("outdated")
            ? 85
            : 65,
        x: -420,
        y: 120 + index * 110,
        extra: {
          source: "live_host",
          category: "finding",
        },
      }),
    );

    addEdge(
      createEdge({
        source: ipId,
        target: findingId,
        label: "related_finding",
        confidence: 76,
      }),
    );
  });

  return {
    nodes,
    edges,
    focusNodeId: ipId,
  };
}
