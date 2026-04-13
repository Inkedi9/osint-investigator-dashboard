export const mockGraph = {
  nodes: [
    {
      id: "ent_001",
      position: { x: 250, y: 120 },
      data: { label: "suspicious-example.com", type: "domain" },
      type: "default",
    },
    {
      id: "ent_002",
      position: { x: 80, y: 280 },
      data: { label: "185.45.12.90", type: "ip" },
      type: "default",
    },
    {
      id: "ent_003",
      position: { x: 430, y: 280 },
      data: { label: "admin@suspicious-example.com", type: "email" },
      type: "default",
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: "ent_001",
      target: "ent_002",
      label: "resolves_to",
      animated: true,
    },
    {
      id: "e1-3",
      source: "ent_001",
      target: "ent_003",
      label: "related_to",
      animated: true,
    },
  ],
};
