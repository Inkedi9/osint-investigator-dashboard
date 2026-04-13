import { loadCases } from "./caseStorage";

export function getDashboardMetrics(mockCases, mockEntities) {
  const cases = loadCases(mockCases);

  const openInvestigations = cases.filter(
    (item) => item.status === "Open" || item.status === "In Review",
  ).length;

  const trackedEntityIds = new Set(
    cases.flatMap((item) => item.entityIds || []),
  );

  const trackedEntities = trackedEntityIds.size;

  const highRiskFindings = mockEntities.filter(
    (entity) => trackedEntityIds.has(entity.id) && entity.riskScore >= 70,
  ).length;

  const sourcesQueried = 9;

  return {
    openInvestigations,
    trackedEntities,
    highRiskFindings,
    sourcesQueried,
    cases,
  };
}

export function getRecentActivity(cases, mockEntities) {
  const activities = [];

  cases.forEach((caseItem) => {
    activities.push({
      id: `${caseItem.id}-created`,
      date: caseItem.createdAt,
      label: `Case created: ${caseItem.title}`,
    });

    (caseItem.notes || []).forEach((note) => {
      activities.push({
        id: note.id,
        date: note.createdAt,
        label: `Analyst note added in ${caseItem.title}`,
      });
    });

    (caseItem.entityIds || []).forEach((entityId) => {
      const entity = mockEntities.find((item) => item.id === entityId);
      if (entity) {
        activities.push({
          id: `${caseItem.id}-${entityId}`,
          date: caseItem.createdAt,
          label: `${entity.value} linked to ${caseItem.title}`,
        });
      }
    });
  });

  return activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);
}

export function getStatusDistribution(cases) {
  const counts = {
    Open: 0,
    "In Review": 0,
    Closed: 0,
  };

  cases.forEach((item) => {
    if (counts[item.status] !== undefined) {
      counts[item.status] += 1;
    }
  });

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
}

export function getPriorityDistribution(cases) {
  const counts = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  cases.forEach((item) => {
    if (counts[item.priority] !== undefined) {
      counts[item.priority] += 1;
    }
  });

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
}
