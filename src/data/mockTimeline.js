export const mockTimeline = [
  {
    entityId: "ent_001",
    events: [
      {
        id: "t1",
        type: "detection",
        label: "Suspicious domain detected",
        date: "2026-04-13T14:12:00",
      },
      {
        id: "t2",
        type: "relation",
        label: "Linked IP discovered (185.45.12.90)",
        date: "2026-04-13T13:00:00",
      },
      {
        id: "t3",
        type: "creation",
        label: "Domain registered",
        date: "2026-03-01T09:00:00",
      },
    ],
  },
  {
    entityId: "ent_003",
    events: [
      {
        id: "t4",
        type: "breach",
        label: "Email found in 3 data breaches",
        date: "2025-12-10T10:00:00",
      },
    ],
  },
];
