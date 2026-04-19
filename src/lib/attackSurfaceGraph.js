function slug(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]/g, "-");
}

function getSeverityRisk(severity) {
  if (severity === "critical") return 95;
  if (severity === "high") return 85;
  if (severity === "medium") return 70;
  if (severity === "low") return 45;
  return 50;
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

function getColumnY(index, spacing = 150, start = -120) {
  return start + index * spacing;
}

export function buildAttackSurfaceGraph(domain, scanData) {
  if (!domain || !scanData) {
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

  const rootId = `domain:${slug(domain)}`;

  addNode(
    createNode({
      id: rootId,
      label: domain,
      type: "domain",
      riskScore: scanData.score ?? 60,
      x: 0,
      y: 0,
      extra: {
        source: "attack_surface",
        summary: scanData.summary || "Primary scanned domain",
        status: "active",
      },
    }),
  );

  const subdomainIds = new Set();

  (scanData.subdomains || []).forEach((subdomain, index) => {
    const subLabel =
      typeof subdomain === "string"
        ? subdomain
        : subdomain.name || `subdomain-${index + 1}`;

    const subId = `domain:${slug(subLabel)}`;
    subdomainIds.add(subId);

    addNode(
      createNode({
        id: subId,
        label: subLabel,
        type: "domain",
        riskScore:
          typeof subdomain === "object" &&
          typeof subdomain.riskScore === "number"
            ? subdomain.riskScore
            : Math.max((scanData.score ?? 60) - 5, 35),
        x: -380,
        y: getColumnY(index, 140, -80),
        extra: {
          source: "attack_surface",
          category: "subdomain",
          parentDomain: domain,
        },
      }),
    );

    addEdge(
      createEdge({
        source: rootId,
        target: subId,
        label: "hosts",
        confidence: 95,
      }),
    );
  });

  (scanData.assets || []).forEach((asset, index) => {
    const assetLabel =
      asset.host ||
      asset.hostname ||
      asset.name ||
      asset.value ||
      asset.ip ||
      `asset-${index + 1}`;

    const assetType =
      asset.type === "ip"
        ? "ip"
        : asset.type === "service"
          ? "service"
          : asset.ip
            ? "ip"
            : "ip";

    const assetId = `${assetType}:${slug(assetLabel)}`;

    addNode(
      createNode({
        id: assetId,
        label: assetLabel,
        type: assetType,
        riskScore: asset.riskScore || asset.risk || scanData.score || 55,
        x: 380,
        y: getColumnY(index, 170, -100),
        extra: {
          source: "attack_surface",
          category: asset.category || "asset",
          status: asset.status || "exposed",
          ports: asset.ports || [],
          technologies: asset.technologies || asset.tech || [],
          provider: asset.provider,
          country: asset.country,
        },
      }),
    );

    const linkedSubdomain = asset.subdomain || asset.hostname || null;

    if (linkedSubdomain) {
      const subId = `domain:${slug(linkedSubdomain)}`;

      if (!subdomainIds.has(subId)) {
        subdomainIds.add(subId);

        addNode(
          createNode({
            id: subId,
            label: linkedSubdomain,
            type: "domain",
            riskScore: asset.riskScore || 60,
            x: -380,
            y: getColumnY(subdomainIds.size - 1, 140, -80),
            extra: {
              source: "attack_surface",
              category: "subdomain",
              parentDomain: domain,
            },
          }),
        );

        addEdge(
          createEdge({
            source: rootId,
            target: subId,
            label: "hosts",
            confidence: 95,
          }),
        );
      }

      addEdge(
        createEdge({
          source: subId,
          target: assetId,
          label: assetType === "ip" ? "resolves_to" : "exposes",
          confidence: 90,
        }),
      );
    } else {
      addEdge(
        createEdge({
          source: rootId,
          target: assetId,
          label: assetType === "ip" ? "resolves_to" : "exposes",
          confidence: 88,
        }),
      );
    }

    (asset.services || []).forEach((service, serviceIndex) => {
      const serviceName =
        typeof service === "string"
          ? service
          : service.name || `service-${serviceIndex + 1}`;

      const servicePort = typeof service === "object" ? service.port : null;

      const serviceLabel = servicePort
        ? `${serviceName}:${servicePort}`
        : serviceName;

      const serviceId = `service:${slug(assetLabel)}:${slug(serviceLabel)}`;

      addNode(
        createNode({
          id: serviceId,
          label: serviceLabel,
          type: "service",
          riskScore: asset.riskScore || asset.risk || 70,
          x: 760,
          y: getColumnY(index * 2 + serviceIndex, 120, -80),
          extra: {
            source: "attack_surface",
            category: "service",
            port: servicePort,
            version: typeof service === "object" ? service.version : undefined,
          },
        }),
      );

      addEdge(
        createEdge({
          source: assetId,
          target: serviceId,
          label: "hosts_service",
          confidence: 92,
        }),
      );
    });
  });

  (scanData.findings || []).forEach((finding, index) => {
    const findingLabel =
      finding.title || finding.name || `finding-${index + 1}`;

    const findingId = `finding:${slug(findingLabel)}:${index}`;

    addNode(
      createNode({
        id: findingId,
        label: findingLabel,
        type: "service",
        riskScore: getSeverityRisk(finding.severity),
        x: -760,
        y: getColumnY(index, 150, -80),
        extra: {
          source: "attack_surface",
          category: "finding",
          severity: finding.severity || "low",
          description: finding.description || "",
        },
      }),
    );

    addEdge(
      createEdge({
        source: rootId,
        target: findingId,
        label: "related_finding",
        confidence: 75,
      }),
    );
  });

  return {
    nodes,
    edges,
    focusNodeId: rootId,
  };
}
