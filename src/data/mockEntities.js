export const mockEntities = [
  {
    id: "ent_001",
    type: "domain",
    value: "suspicious-example.com",
    riskScore: 82,
    tags: ["phishing", "new-domain"],
    description: "Recently registered domain linked to suspicious activity.",
    metadata: {
      registrar: "Namecheap",
      createdAt: "2026-03-01",
      country: "US",
      ip: "185.45.12.90",
    },
    related: ["ent_002", "ent_003"],
  },
  {
    id: "ent_002",
    type: "ip",
    value: "185.45.12.90",
    riskScore: 65,
    tags: ["hosting", "exposed"],
    description: "Server with multiple open ports detected.",
    metadata: {
      location: "Netherlands",
      isp: "DigitalOcean",
      ports: [22, 80, 443],
    },
    related: ["ent_001"],
  },
  {
    id: "ent_003",
    type: "email",
    value: "admin@suspicious-example.com",
    riskScore: 78,
    tags: ["breach", "leaked"],
    description: "Email found in multiple data breaches.",
    metadata: {
      breaches: 3,
      lastBreach: "2025-12-10",
    },
    related: ["ent_001"],
  },
];
