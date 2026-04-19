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

export const mockGraph = {
  nodes: [
    makeNode(entityMap.ent_001, { x: 180, y: 180 }),
    makeNode(entityMap.ent_004, { x: 470, y: 120 }),
    makeNode(entityMap.ent_006, { x: 470, y: 280 }),
    makeNode(entityMap.ent_008, { x: 760, y: 180 }),
    makeNode(entityMap.ent_009, { x: 1040, y: 120 }),
    makeNode(entityMap.ent_002, { x: 180, y: 360 }),
    makeNode(entityMap.ent_011, { x: 760, y: 360 }),
  ],

  edges: [
    makeEdge({
      id: "rel_001",
      source: "ent_001",
      target: "ent_004",
      type: "resolves_to",
      label: "resolves to",
      confidence: 0.94,
      firstSeen: "2026-03-02T10:22:00Z",
      lastSeen: "2026-04-14T18:40:00Z",
    }),
    makeEdge({
      id: "rel_002",
      source: "ent_001",
      target: "ent_006",
      type: "uses_email",
      label: "uses email",
      confidence: 0.88,
      firstSeen: "2026-03-03T09:00:00Z",
      lastSeen: "2026-04-15T08:54:00Z",
    }),
    makeEdge({
      id: "rel_003",
      source: "ent_006",
      target: "ent_008",
      type: "linked_username",
      label: "linked username",
      confidence: 0.71,
      firstSeen: "2026-03-05T16:11:00Z",
      lastSeen: "2026-04-14T12:20:00Z",
    }),
    makeEdge({
      id: "rel_004",
      source: "ent_004",
      target: "ent_009",
      type: "hosts_service",
      label: "hosts service",
      confidence: 0.91,
      firstSeen: "2026-03-20T10:40:00Z",
      lastSeen: "2026-04-15T19:05:00Z",
    }),
    makeEdge({
      id: "rel_005",
      source: "ent_001",
      target: "ent_002",
      type: "similar_to",
      label: "similar to",
      confidence: 0.86,
      firstSeen: "2026-03-09T08:15:00Z",
      lastSeen: "2026-04-13T11:05:00Z",
    }),
    makeEdge({
      id: "rel_006",
      source: "ent_002",
      target: "ent_011",
      type: "hosts_service",
      label: "runs frontend",
      confidence: 0.78,
      firstSeen: "2026-03-10T11:42:00Z",
      lastSeen: "2026-04-12T18:02:00Z",
    }),
    makeEdge({
      id: "rel_007",
      source: "ent_001",
      target: "ent_011",
      type: "shared_infrastructure",
      label: "shared infra",
      confidence: 0.74,
      firstSeen: "2026-03-04T10:00:00Z",
      lastSeen: "2026-04-15T19:12:00Z",
    }),
    makeEdge({
      id: "rel_008",
      source: "ent_001",
      target: "ent_008",
      type: "registered_with",
      label: "registered with",
      confidence: 0.63,
      firstSeen: "2026-03-02T10:25:00Z",
      lastSeen: "2026-04-09T13:10:00Z",
    }),
    makeEdge({
      id: "rel_009",
      source: "ent_002",
      target: "ent_004",
      type: "resolves_to",
      label: "resolves to",
      confidence: 0.84,
      firstSeen: "2026-03-09T08:15:00Z",
      lastSeen: "2026-04-13T11:05:00Z",
    }),
    makeEdge({
      id: "rel_010",
      source: "ent_001",
      target: "ent_009",
      type: "shared_tls",
      label: "shared tls",
      confidence: 0.69,
      firstSeen: "2026-03-21T09:30:00Z",
      lastSeen: "2026-04-14T17:50:00Z",
    }),
  ],
};
