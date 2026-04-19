function sortEventsDesc(events = []) {
  return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const mockTimeline = [
  {
    entityId: "ent_001",
    events: sortEventsDesc([
      {
        id: "evt_001",
        entityId: "ent_001",
        type: "detection",
        title: "Lookalike domain observed in passive DNS",
        description:
          "The domain micr0soft-support.com was first observed in passive DNS associated with suspicious hosting infrastructure.",
        date: "2026-03-02T10:22:00Z",
        source: "Passive DNS",
        confidence: 0.93,
        severity: "high",
      },
      {
        id: "evt_002",
        entityId: "ent_001",
        type: "relation",
        title: "Domain linked to shared hosting IP",
        description:
          "The domain resolved to 185.193.88.24, an IP later linked to multiple suspicious infrastructure indicators.",
        date: "2026-03-02T10:30:00Z",
        source: "Passive DNS",
        confidence: 0.94,
        severity: "medium",
      },
      {
        id: "evt_003",
        entityId: "ent_001",
        type: "artifact",
        title: "WHOIS contact artifacts identified",
        description:
          "WHOIS analysis revealed contact overlaps and reusable registration metadata across the suspicious cluster.",
        date: "2026-03-02T10:40:00Z",
        source: "WHOIS",
        confidence: 0.72,
        severity: "medium",
      },
      {
        id: "evt_004",
        entityId: "ent_001",
        type: "scan",
        title: "TLS fingerprint similarity detected",
        description:
          "TLS fingerprinting suggested reuse of infrastructure and front-end configuration across related domains.",
        date: "2026-03-21T09:30:00Z",
        source: "TLS Scan",
        confidence: 0.69,
        severity: "medium",
      },
    ]),
  },
  {
    entityId: "ent_002",
    events: sortEventsDesc([
      {
        id: "evt_005",
        entityId: "ent_002",
        type: "detection",
        title: "Related support domain identified",
        description:
          "microsoft-support-help.net was observed as a secondary support-themed domain linked to the main scenario.",
        date: "2026-03-09T08:15:00Z",
        source: "Passive DNS",
        confidence: 0.88,
        severity: "high",
      },
      {
        id: "evt_006",
        entityId: "ent_002",
        type: "relation",
        title: "Similarity match with primary lookalike domain",
        description:
          "String similarity and shared registration patterns strongly linked this domain with micr0soft-support.com.",
        date: "2026-03-09T09:00:00Z",
        source: "Similarity Engine",
        confidence: 0.86,
        severity: "medium",
      },
      {
        id: "evt_007",
        entityId: "ent_002",
        type: "service",
        title: "Frontend web service observed",
        description:
          "A public-facing nginx frontend was observed supporting the domain’s visible infrastructure.",
        date: "2026-03-10T11:42:00Z",
        source: "Banner Grab",
        confidence: 0.78,
        severity: "medium",
      },
    ]),
  },
  {
    entityId: "ent_003",
    events: sortEventsDesc([
      {
        id: "evt_008",
        entityId: "ent_003",
        type: "detection",
        title: "Credential-themed login domain detected",
        description:
          "login-microsoft365-alert.net was flagged as a likely credential harvesting domain.",
        date: "2026-03-18T07:42:00Z",
        source: "URL Scan",
        confidence: 0.95,
        severity: "high",
      },
      {
        id: "evt_009",
        entityId: "ent_003",
        type: "artifact",
        title: "Certificate transparency overlap observed",
        description:
          "Certificate monitoring revealed overlaps with another suspicious authentication-themed pivot domain.",
        date: "2026-03-25T12:08:00Z",
        source: "Certificate Transparency",
        confidence: 0.9,
        severity: "high",
      },
      {
        id: "evt_010",
        entityId: "ent_003",
        type: "relation",
        title: "Linked to support email infrastructure",
        description:
          "The domain was correlated with support@micr0soft-support.com through metadata and shared workflow indicators.",
        date: "2026-03-26T08:50:00Z",
        source: "OSINT Correlation",
        confidence: 0.77,
        severity: "medium",
      },
    ]),
  },
  {
    entityId: "ent_004",
    events: sortEventsDesc([
      {
        id: "evt_011",
        entityId: "ent_004",
        type: "scan",
        title: "Exposed hosting IP discovered",
        description:
          "185.193.88.24 was observed exposing web-related ports and hosting suspicious lookalike domains.",
        date: "2026-03-02T10:30:00Z",
        source: "Port Scan",
        confidence: 0.9,
        severity: "high",
      },
      {
        id: "evt_012",
        entityId: "ent_004",
        type: "service",
        title: "Administrative interface exposed",
        description:
          "An administrative HTTPS interface was detected on the host, increasing the investigation priority.",
        date: "2026-03-20T10:40:00Z",
        source: "Banner Grab",
        confidence: 0.91,
        severity: "high",
      },
      {
        id: "evt_013",
        entityId: "ent_004",
        type: "relation",
        title: "Shared infrastructure correlation",
        description:
          "Secondary IP 91.224.92.117 was later connected to the same cluster through mail-related service pivots.",
        date: "2026-03-21T13:04:00Z",
        source: "Reverse IP / Correlation",
        confidence: 0.73,
        severity: "medium",
      },
    ]),
  },

  {
    entityId: "ent_005",
    events: sortEventsDesc([
      {
        id: "evt_014",
        entityId: "ent_005",
        type: "detection",
        title: "Secondary infrastructure node identified",
        description:
          "91.224.92.117 was identified during infrastructure expansion and linked to mail services.",
        date: "2026-03-21T13:04:00Z",
        source: "Reverse IP",
        confidence: 0.76,
        severity: "medium",
      },
      {
        id: "evt_015",
        entityId: "ent_005",
        type: "service",
        title: "Mail relay exposure confirmed",
        description:
          "SMTP-related service exposure suggested the host may support phishing message delivery or relay.",
        date: "2026-03-22T08:10:00Z",
        source: "SMTP Banner",
        confidence: 0.78,
        severity: "high",
      },
    ]),
  },

  {
    entityId: "ent_006",
    events: sortEventsDesc([
      {
        id: "evt_016",
        entityId: "ent_006",
        type: "artifact",
        title: "Support-themed contact address identified",
        description:
          "support@micr0soft-support.com was observed in registration and messaging artifacts linked to the suspicious cluster.",
        date: "2026-03-03T09:00:00Z",
        source: "Mail Header / WHOIS",
        confidence: 0.85,
        severity: "medium",
      },
      {
        id: "evt_017",
        entityId: "ent_006",
        type: "relation",
        title: "Linked to username artifact",
        description:
          "The address was correlated with the username ms-update-admin via panel and contact artifacts.",
        date: "2026-03-05T16:11:00Z",
        source: "Artifact Correlation",
        confidence: 0.71,
        severity: "medium",
      },
      {
        id: "evt_018",
        entityId: "ent_006",
        type: "service",
        title: "SMTP relay association observed",
        description:
          "The address was later associated with a suspicious SMTP relay uncovered during graph expansion.",
        date: "2026-03-12T18:24:00Z",
        source: "SMTP Banner",
        confidence: 0.82,
        severity: "high",
      },
    ]),
  },

  {
    entityId: "ent_007",
    events: sortEventsDesc([
      {
        id: "evt_019",
        entityId: "ent_007",
        type: "artifact",
        title: "Billing-themed contact identified",
        description:
          "billing@microsoft-support-help.net was extracted from registration metadata for a related domain.",
        date: "2026-03-11T14:18:00Z",
        source: "WHOIS",
        confidence: 0.72,
        severity: "low",
      },
      {
        id: "evt_020",
        entityId: "ent_007",
        type: "relation",
        title: "Mail infrastructure overlap observed",
        description:
          "The email was linked to the secondary infrastructure node and mail service pivots.",
        date: "2026-03-22T10:02:00Z",
        source: "Mail Correlation",
        confidence: 0.74,
        severity: "medium",
      },
    ]),
  },

  {
    entityId: "ent_008",
    events: sortEventsDesc([
      {
        id: "evt_021",
        entityId: "ent_008",
        type: "activity",
        title: "Operator-linked username observed",
        description:
          "ms-update-admin was recovered from infrastructure artifacts and appears linked to admin workflows.",
        date: "2026-03-05T16:11:00Z",
        source: "Open Directory",
        confidence: 0.67,
        severity: "medium",
      },
      {
        id: "evt_022",
        entityId: "ent_008",
        type: "relation",
        title: "Username associated with support email and admin panel",
        description:
          "The username was correlated with both messaging artifacts and exposed administrative access patterns.",
        date: "2026-03-20T12:15:00Z",
        source: "Artifact Correlation",
        confidence: 0.73,
        severity: "medium",
      },
    ]),
  },

  {
    entityId: "ent_009",
    events: sortEventsDesc([
      {
        id: "evt_023",
        entityId: "ent_009",
        type: "service",
        title: "HTTPS admin panel identified",
        description:
          "An exposed administrative HTTPS panel was observed on infrastructure serving the suspicious cluster.",
        date: "2026-03-20T10:40:00Z",
        source: "Port Scan / Banner Grab",
        confidence: 0.9,
        severity: "high",
      },
      {
        id: "evt_024",
        entityId: "ent_009",
        type: "relation",
        title: "Shared TLS pivot discovered",
        description:
          "Graph expansion revealed another authentication-themed domain with a highly similar TLS profile.",
        date: "2026-03-25T12:08:00Z",
        source: "TLS Correlation",
        confidence: 0.88,
        severity: "high",
      },
    ]),
  },

  {
    entityId: "ent_010",
    events: sortEventsDesc([
      {
        id: "evt_025",
        entityId: "ent_010",
        type: "service",
        title: "SMTP relay service discovered",
        description:
          "SMTP relay service was identified as part of the expanded infrastructure graph.",
        date: "2026-03-12T18:24:00Z",
        source: "SMTP Banner",
        confidence: 0.79,
        severity: "high",
      },
      {
        id: "evt_026",
        entityId: "ent_010",
        type: "activity",
        title: "Mail support workflow suspected",
        description:
          "The relay appears connected to support and billing-themed contact addresses used in the suspicious cluster.",
        date: "2026-03-22T08:10:00Z",
        source: "Message Flow Inference",
        confidence: 0.68,
        severity: "medium",
      },
    ]),
  },

  {
    entityId: "ent_011",
    events: sortEventsDesc([
      {
        id: "evt_027",
        entityId: "ent_011",
        type: "service",
        title: "Public-facing nginx service observed",
        description:
          "The service was observed supporting one of the suspicious support-themed domains.",
        date: "2026-03-10T11:42:00Z",
        source: "Banner Grab",
        confidence: 0.74,
        severity: "medium",
      },
      {
        id: "evt_028",
        entityId: "ent_011",
        type: "relation",
        title: "Shared frontend pattern with admin-facing service",
        description:
          "Configuration patterns overlapped with other web-facing services in the same infrastructure cluster.",
        date: "2026-03-21T09:30:00Z",
        source: "Web Fingerprint",
        confidence: 0.69,
        severity: "low",
      },
    ]),
  },

  {
    entityId: "ent_012",
    events: sortEventsDesc([
      {
        id: "evt_029",
        entityId: "ent_012",
        type: "artifact",
        title: "Phone number extracted from registration data",
        description:
          "A Dutch phone number was recovered from WHOIS information tied to the suspicious support domain cluster.",
        date: "2026-03-02T10:21:00Z",
        source: "WHOIS",
        confidence: 0.61,
        severity: "low",
      },
      {
        id: "evt_030",
        entityId: "ent_012",
        type: "relation",
        title: "Shared registration contact observed",
        description:
          "The same phone artifact was later associated with multiple domain registration records.",
        date: "2026-03-09T08:20:00Z",
        source: "WHOIS Correlation",
        confidence: 0.63,
        severity: "low",
      },
    ]),
  },

  {
    entityId: "ent_013",
    events: sortEventsDesc([
      {
        id: "evt_031",
        entityId: "ent_013",
        type: "detection",
        title: "Expanded pivot domain discovered",
        description:
          "office365-auth-check.com was discovered during graph expansion from the admin panel and login-themed domain path.",
        date: "2026-03-25T12:08:00Z",
        source: "Graph Expansion / CT Logs",
        confidence: 0.87,
        severity: "high",
      },
      {
        id: "evt_032",
        entityId: "ent_013",
        type: "artifact",
        title: "Authentication wording overlap detected",
        description:
          "The domain reused language patterns associated with Microsoft 365 verification and account security themes.",
        date: "2026-03-26T07:44:00Z",
        source: "Content Fingerprint",
        confidence: 0.84,
        severity: "high",
      },
      {
        id: "evt_033",
        entityId: "ent_013",
        type: "breach",
        title: "Potential credential collection infrastructure",
        description:
          "The domain was assessed as likely credential collection infrastructure due to thematic overlap and cluster proximity.",
        date: "2026-04-01T09:32:00Z",
        source: "Analyst Assessment",
        confidence: 0.8,
        severity: "high",
      },
    ]),
  },
];
