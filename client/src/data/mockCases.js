export const mockCases = [
  {
    id: "case_001",
    title: "Phishing Infrastructure Investigation",
    description:
      "Investigation into a suspicious domain and related infrastructure potentially used for phishing.",
    status: "Open",
    priority: "High",
    createdAt: "2026-04-13",
    entityIds: ["ent_001", "ent_002", "ent_003"],
    notes: [
      {
        id: "note_001",
        content:
          "Domain appears recently registered and linked to suspicious mail activity.",
        createdAt: "2026-04-13 14:10",
      },
      {
        id: "note_002",
        content:
          "Infrastructure overlaps with exposed IP used in other suspicious contexts.",
        createdAt: "2026-04-13 15:20",
      },
    ],
  },
  {
    id: "case_002",
    title: "Breached Identity Review",
    description:
      "Review of leaked email exposure and associated entities found during enrichment.",
    status: "In Review",
    priority: "Medium",
    createdAt: "2026-04-12",
    entityIds: ["ent_003"],
    notes: [
      {
        id: "note_003",
        content: "Email linked to multiple data breach records.",
        createdAt: "2026-04-12 18:00",
      },
    ],
  },
];
