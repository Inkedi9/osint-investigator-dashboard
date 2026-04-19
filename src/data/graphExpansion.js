import { mockEntities } from "./mockEntities";

function nodeLabel(entity) {
  return entity.displayName || entity.value;
}

function makeNode(entity, position) {
  return {
    id: entity.id,
    position,
    data: {
      label: nodeLabel(entity),
      labelText: nodeLabel(entity),
      type: entity.type,
      riskScore: entity.riskScore,
      country: entity.country,
      status: entity.status,
      tags: entity.tags,
      confidence: entity.confidence,
      source: entity.source,
    },
  };
}

function makeEdge({
  id,
  source,
  target,
  type,
  label,
  confidence,
  firstSeen,
  lastSeen,
}) {
  return {
    id,
    source,
    target,
    from: source,
    to: target,
    type,
    label,
    confidence,
    firstSeen,
    lastSeen,
  };
}

const entityMap = Object.fromEntries(
  mockEntities.map((entity) => [entity.id, entity]),
);

export const graphExpansionMap = {
  ent_001: {
    depth: 1,
    nodes: [
      makeNode(entityMap.ent_003, { x: 160, y: 30 }),
      makeNode(entityMap.ent_012, { x: 160, y: 520 }),
    ],
    edges: [
      makeEdge({
        id: "rel_exp_001",
        source: "ent_001",
        target: "ent_003",
        type: "similar_to",
        label: "similar to",
        confidence: 0.91,
        firstSeen: "2026-03-18T07:42:00Z",
        lastSeen: "2026-04-15T09:14:00Z",
      }),
      makeEdge({
        id: "rel_exp_002",
        source: "ent_001",
        target: "ent_012",
        type: "registered_with",
        label: "registered with",
        confidence: 0.62,
        firstSeen: "2026-03-02T10:21:00Z",
        lastSeen: "2026-04-09T13:10:00Z",
      }),
    ],
  },

  ent_002: {
    depth: 1,
    nodes: [makeNode(entityMap.ent_007, { x: 180, y: 560 })],
    edges: [
      makeEdge({
        id: "rel_exp_003",
        source: "ent_002",
        target: "ent_007",
        type: "uses_email",
        label: "uses email",
        confidence: 0.79,
        firstSeen: "2026-03-11T14:18:00Z",
        lastSeen: "2026-04-10T17:35:00Z",
      }),
    ],
  },

  ent_004: {
    depth: 1,
    nodes: [makeNode(entityMap.ent_005, { x: 760, y: 40 })],
    edges: [
      makeEdge({
        id: "rel_exp_004",
        source: "ent_004",
        target: "ent_005",
        type: "shared_infrastructure",
        label: "shared infra",
        confidence: 0.73,
        firstSeen: "2026-03-21T13:04:00Z",
        lastSeen: "2026-04-12T15:28:00Z",
      }),
    ],
  },

  ent_006: {
    depth: 1,
    nodes: [makeNode(entityMap.ent_010, { x: 760, y: 500 })],
    edges: [
      makeEdge({
        id: "rel_exp_005",
        source: "ent_006",
        target: "ent_010",
        type: "related_service",
        label: "related service",
        confidence: 0.82,
        firstSeen: "2026-03-12T18:24:00Z",
        lastSeen: "2026-04-12T19:11:00Z",
      }),
    ],
  },

  ent_009: {
    depth: 1,
    nodes: [makeNode(entityMap.ent_013, { x: 1220, y: 260 })],
    edges: [
      makeEdge({
        id: "rel_exp_006",
        source: "ent_009",
        target: "ent_013",
        type: "shared_tls",
        label: "shared tls",
        confidence: 0.88,
        firstSeen: "2026-03-25T12:08:00Z",
        lastSeen: "2026-04-15T10:44:00Z",
      }),
    ],
  },

  ent_003: {
    depth: 2,
    nodes: [makeNode(entityMap.ent_013, { x: 420, y: -80 })],
    edges: [
      makeEdge({
        id: "rel_exp_007",
        source: "ent_003",
        target: "ent_013",
        type: "shared_tls",
        label: "shared tls",
        confidence: 0.9,
        firstSeen: "2026-03-25T12:08:00Z",
        lastSeen: "2026-04-15T10:44:00Z",
      }),
    ],
  },

  ent_005: {
    depth: 2,
    nodes: [makeNode(entityMap.ent_010, { x: 1040, y: 500 })],
    edges: [
      makeEdge({
        id: "rel_exp_008",
        source: "ent_005",
        target: "ent_010",
        type: "hosts_service",
        label: "hosts service",
        confidence: 0.76,
        firstSeen: "2026-03-22T08:10:00Z",
        lastSeen: "2026-04-12T19:11:00Z",
      }),
    ],
  },
};
