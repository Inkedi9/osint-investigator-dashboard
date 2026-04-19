const STORAGE_KEY = "osint_graph_investigation_context";

export function loadGraphInvestigationContext() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error("Failed to load graph investigation context:", error);
    return {};
  }
}

export function saveGraphInvestigationContext(caseId, context) {
  try {
    const existing = loadGraphInvestigationContext();

    const updated = {
      ...existing,
      [caseId]: {
        ...existing[caseId],
        ...context,
        updatedAt: new Date().toISOString(),
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save graph investigation context:", error);
  }
}

export function getGraphInvestigationContext(caseId) {
  const all = loadGraphInvestigationContext();
  return all[caseId] || null;
}
