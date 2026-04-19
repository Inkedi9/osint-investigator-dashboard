export const mockCases = [
  {
    id: "case_001",
    title: "Microsoft 365 Lookalike Infrastructure Cluster",
    description:
      "Investigation into a suspicious cluster of Microsoft-themed lookalike domains, shared hosting infrastructure, and exposed web services associated with phishing activity.",
    entityIds: [
      "ent_001",
      "ent_002",
      "ent_004",
      "ent_006",
      "ent_009",
      "ent_011",
    ],
    status: "investigating",
    priority: "high",
    createdAt: "2026-04-10T09:00:00Z",
    assignee: "You",
    reviewer: "Demo Reviewer",
    notes: [
      {
        id: "note_001",
        content:
          "Primary cluster appears to rely on shared hosting and repeated support-themed registration patterns.",
        createdAt: "2026-04-10T10:20:00Z",
        author: "You",
      },
      {
        id: "note_002",
        content:
          "Main investigative priority is validating whether the exposed admin-facing service is operationally linked to the phishing workflow.",
        createdAt: "2026-04-11T14:45:00Z",
        author: "You",
      },
    ],
    comments: [
      {
        id: "comment_001",
        author: "Demo Reviewer",
        date: "2026-04-12T11:05:00Z",
        content:
          "Recommend pivoting further on TLS overlap and any related login-themed domains.",
      },
    ],
    activity: [
      {
        id: "act_001",
        action: "Case created",
        author: "You",
        date: "2026-04-10T09:00:00Z",
      },
      {
        id: "act_002",
        action: "Linked entities reviewed",
        author: "You",
        date: "2026-04-10T10:35:00Z",
      },
      {
        id: "act_003",
        action: "Priority set to high",
        author: "You",
        date: "2026-04-10T10:40:00Z",
      },
    ],
  },

  {
    id: "case_002",
    title: "Credential Harvesting Landing Page Expansion",
    description:
      "Focused investigation on login-themed domains and graph-discovered pivots likely associated with credential collection workflows.",
    entityIds: ["ent_003", "ent_006", "ent_009", "ent_013"],
    status: "open",
    priority: "high",
    createdAt: "2026-04-12T08:30:00Z",
    assignee: "You",
    reviewer: "CTI Lead",
    notes: [
      {
        id: "note_003",
        content:
          "The login-themed domain has the strongest credential harvesting indicators in the current dataset.",
        createdAt: "2026-04-12T09:10:00Z",
        author: "You",
      },
    ],
    comments: [
      {
        id: "comment_002",
        author: "CTI Lead",
        date: "2026-04-12T12:18:00Z",
        content:
          "Track any newly discovered pivots and compare wording/theme overlap before final assessment.",
      },
    ],
    activity: [
      {
        id: "act_004",
        action: "Case created",
        author: "You",
        date: "2026-04-12T08:30:00Z",
      },
      {
        id: "act_005",
        action: "Pivot path identified from admin service",
        author: "You",
        date: "2026-04-12T09:42:00Z",
      },
    ],
  },

  {
    id: "case_003",
    title: "Mail Relay and Support Contact Correlation",
    description:
      "Investigation into support and billing-themed email artifacts, related SMTP infrastructure, and secondary support nodes.",
    entityIds: ["ent_005", "ent_007", "ent_010", "ent_012"],
    status: "open",
    priority: "medium",
    createdAt: "2026-04-13T13:15:00Z",
    assignee: "You",
    reviewer: "Infra Analyst",
    notes: [
      {
        id: "note_004",
        content:
          "Secondary infrastructure appears less critical than the core phishing cluster, but may support message delivery.",
        createdAt: "2026-04-13T14:00:00Z",
        author: "You",
      },
    ],
    comments: [],
    activity: [
      {
        id: "act_006",
        action: "Case created",
        author: "You",
        date: "2026-04-13T13:15:00Z",
      },
      {
        id: "act_007",
        action: "SMTP relay reviewed",
        author: "You",
        date: "2026-04-13T14:22:00Z",
      },
    ],
  },
];
