const reportCases = [
  {
    id: "case_001",
    title: "Microsoft 365 Lookalike Infrastructure Cluster",
    description:
      "Investigation into a suspicious cluster of Microsoft-themed lookalike domains, shared hosting infrastructure, and exposed web services associated with phishing activity.",
    status: "investigating",
    priority: "high",
    createdAt: "2026-04-10T09:00:00Z",
    entityIds: [
      "ent_001",
      "ent_002",
      "ent_004",
      "ent_006",
      "ent_009",
      "ent_011",
    ],
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
    status: "open",
    priority: "high",
    createdAt: "2026-04-12T08:30:00Z",
    entityIds: ["ent_003", "ent_006", "ent_009", "ent_013"],
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
    status: "open",
    priority: "medium",
    createdAt: "2026-04-13T13:15:00Z",
    entityIds: ["ent_005", "ent_007", "ent_010", "ent_012"],
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

const reportEntities = [
  {
    id: "ent_001",
    type: "domain",
    value: "micr0soft-support.com",
    displayName: "micr0soft-support.com",
    riskScore: 92,
    description:
      "Lookalike Microsoft-themed domain observed in phishing infrastructure targeting Microsoft 365 users.",
    tags: ["phishing", "lookalike", "credential-harvest", "infra"],
    country: "NL",
    status: "active",
  },
  {
    id: "ent_002",
    type: "domain",
    value: "microsoft-support-help.net",
    displayName: "microsoft-support-help.net",
    riskScore: 86,
    description:
      "Secondary suspicious domain reusing the same theme and similar registration pattern as the primary indicator.",
    tags: ["phishing", "lookalike", "infra"],
    country: "NL",
    status: "active",
  },
  {
    id: "ent_003",
    type: "domain",
    value: "login-microsoft365-alert.net",
    displayName: "login-microsoft365-alert.net",
    riskScore: 95,
    description:
      "Credential-themed Microsoft 365 login domain suspected to be used as a phishing landing page.",
    tags: ["phishing", "credential-harvest", "login-theme"],
    country: "DE",
    status: "observed",
  },
  {
    id: "ent_004",
    type: "ip",
    value: "185.193.88.24",
    displayName: "185.193.88.24",
    riskScore: 84,
    description:
      "Hosting IP linked to multiple suspicious domains and exposed web infrastructure.",
    tags: ["infra", "vps", "shared-hosting"],
    country: "NL",
    status: "active",
  },
  {
    id: "ent_005",
    type: "ip",
    value: "91.224.92.117",
    displayName: "91.224.92.117",
    riskScore: 72,
    description:
      "Secondary IP observed in later expansion, possibly used for mail relay or alternate infrastructure.",
    tags: ["infra", "smtp", "supporting-node"],
    country: "DE",
    status: "observed",
  },
  {
    id: "ent_006",
    type: "email",
    value: "support@micr0soft-support.com",
    displayName: "support@micr0soft-support.com",
    riskScore: 81,
    description:
      "Support-themed email address tied to the main suspicious domain.",
    tags: ["email", "phishing", "support"],
    country: "NL",
    status: "active",
  },
  {
    id: "ent_007",
    type: "email",
    value: "billing@microsoft-support-help.net",
    displayName: "billing@microsoft-support-help.net",
    riskScore: 69,
    description:
      "Billing-themed email linked to a related support domain in the same suspicious cluster.",
    tags: ["email", "billing", "infra"],
    country: "DE",
    status: "observed",
  },
  {
    id: "ent_008",
    type: "username",
    value: "ms-update-admin",
    displayName: "ms-update-admin",
    riskScore: 63,
    description:
      "Username observed across contact metadata and infrastructure artifacts tied to the suspicious cluster.",
    tags: ["username", "infra", "operator"],
    country: "Unknown",
    status: "observed",
  },
  {
    id: "ent_009",
    type: "service",
    value: "https-admin-panel",
    displayName: "HTTPS Admin Panel",
    riskScore: 88,
    description:
      "Exposed administrative web interface discovered on infrastructure tied to the suspicious domains.",
    tags: ["service", "admin-panel", "exposed"],
    country: "NL",
    status: "active",
  },
  {
    id: "ent_010",
    type: "service",
    value: "smtp-relay",
    displayName: "SMTP Relay",
    riskScore: 74,
    description:
      "Mail relay service linked to suspicious support and billing email infrastructure.",
    tags: ["service", "smtp", "mail-relay"],
    country: "DE",
    status: "observed",
  },
  {
    id: "ent_011",
    type: "service",
    value: "nginx-frontend",
    displayName: "Nginx Frontend",
    riskScore: 66,
    description:
      "Public-facing web service associated with the suspicious domain cluster.",
    tags: ["service", "web", "frontend"],
    country: "NL",
    status: "active",
  },
  {
    id: "ent_012",
    type: "phone",
    value: "+31-20-555-0199",
    displayName: "+31-20-555-0199",
    riskScore: 58,
    description:
      "Phone number discovered in domain registration and contact metadata.",
    tags: ["phone", "whois", "contact"],
    country: "NL",
    status: "observed",
  },
  {
    id: "ent_013",
    type: "domain",
    value: "office365-auth-check.com",
    displayName: "office365-auth-check.com",
    riskScore: 89,
    description:
      "Authentication-themed domain discovered during graph expansion and linked to the same suspicious cluster.",
    tags: ["phishing", "auth-theme", "new-pivot"],
    country: "DE",
    status: "observed",
  },
];

module.exports = {
  reportCases,
  reportEntities,
};
