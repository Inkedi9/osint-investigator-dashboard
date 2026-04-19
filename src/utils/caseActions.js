import { loadCases, saveCases } from "./caseStorage";
import { mockCases } from "../data/mockCases";
import { saveGraphInvestigationContext } from "./graphInvestigationContext";
import { buildAttackSurfaceGraph } from "../lib/attackSurfaceGraph";
import { buildLiveHostGraph } from "../lib/liveHostGraph";

export function addNoteToCase(caseId, noteContent) {
  const allCases = loadCases(mockCases);

  const newNote = {
    id: `note_${Date.now()}`,
    content: noteContent.trim(),
    createdAt: new Date().toLocaleString(),
  };

  const updatedCases = allCases.map((item) => {
    if (item.id === caseId) {
      return {
        ...item,
        notes: [...(item.notes || []), newNote],
      };
    }

    return item;
  });

  saveCases(updatedCases);

  return {
    updatedCases,
    newNote,
  };
}

function getPriorityFromScore(score = 0) {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

export function createCaseFromAttackSurface(scanData) {
  if (!scanData?.domain) {
    throw new Error("Missing attack surface scan data.");
  }

  const allCases = loadCases(mockCases);
  const now = Date.now();
  const priority = getPriorityFromScore(scanData.score);

  const graphPayload = buildAttackSurfaceGraph(scanData.domain, scanData);

  const entityIds = (graphPayload.nodes || []).map((node) => node.id);
  const uniqueEntityIds = [...new Set(entityIds)];

  const findingsCount = scanData.findings?.length || 0;
  const assetsCount = scanData.assets?.length || 0;
  const subdomainsCount = scanData.subdomains?.length || 0;

  const newCase = {
    id: `case_${now}`,
    title: `Attack Surface Review — ${scanData.domain}`,
    description: `Attack surface investigation opened from domain scan for ${scanData.domain}. Surface score: ${scanData.score}. ${subdomainsCount} subdomain(s), ${assetsCount} asset(s), ${findingsCount} finding(s) identified.`,
    status: "open",
    priority,
    createdAt: new Date().toISOString(),
    entityIds: uniqueEntityIds,
    assignee: "You",
    reviewer: "Unassigned",
    notes: [
      {
        id: `note_${now}`,
        content: `Initial attack surface assessment summary: ${scanData.summary}`,
        createdAt: new Date().toLocaleString(),
      },
    ],
    comments: [],
    activity: [
      {
        id: `act_${now}`,
        action: "Case created from Attack Surface scan",
        author: "You",
        date: new Date().toLocaleString(),
      },
      {
        id: `act_${now + 1}`,
        action: `Linked ${uniqueEntityIds.length} infrastructure indicators`,
        author: "System",
        date: new Date().toLocaleString(),
      },
    ],
    source: "attack_surface",
    domain: scanData.domain,
    score: scanData.score,
  };

  const updatedCases = [newCase, ...allCases];
  saveCases(updatedCases);

  saveGraphInvestigationContext(newCase.id, {
    source: "attack_surface",
    attackSurfaceScan: scanData,
    attackSurfaceGraph: graphPayload,
    pivotTrail: [],
    discoveredPivotIds: [],
    discoveredPivots: [],
  });

  return {
    newCase,
    updatedCases,
  };
}

export function addAlertToCase(caseId, alert) {
  const allCases = loadCases(mockCases);

  const updatedCases = allCases.map((item) => {
    if (item.id === caseId) {
      const newActivity = {
        id: `act_${Date.now()}`,
        action: `Alert generated: ${alert.title}`,
        author: "System",
        date: new Date().toLocaleString(),
        metadata: {
          severity: alert.severity,
          confidence: alert.confidence,
          source: alert.source,
        },
      };

      return {
        ...item,
        activity: [...(item.activity || []), newActivity],
      };
    }

    return item;
  });

  saveCases(updatedCases);

  return updatedCases;
}

export function addAlertTriageToCase(caseId, alert, triageStatus) {
  const allCases = loadCases(mockCases);

  const updatedCases = allCases.map((item) => {
    if (item.id === caseId) {
      const newActivity = {
        id: `act_${Date.now()}`,
        action: `Alert triage: ${alert.title}`,
        author: "You",
        date: new Date().toLocaleString(),
        content: `Status set to ${triageStatus}. Severity: ${alert.severity}. Confidence: ${alert.confidence}%.`,
        metadata: {
          alertId: alert.id,
          triageStatus,
          severity: alert.severity,
          confidence: alert.confidence,
          source: alert.source,
        },
      };

      return {
        ...item,
        activity: [...(item.activity || []), newActivity],
      };
    }

    return item;
  });

  saveCases(updatedCases);
  return updatedCases;
}

export function createCaseFromLiveHost(hostData) {
  if (!hostData?.ip) {
    throw new Error("Missing live host intelligence data.");
  }

  const allCases = loadCases(mockCases);
  const now = Date.now();

  const priority =
    (hostData.riskScore || 0) >= 80
      ? "high"
      : (hostData.riskScore || 0) >= 60
        ? "medium"
        : "low";

  const graphPayload = buildLiveHostGraph(hostData);
  const entityIds = (graphPayload.nodes || []).map((node) => node.id);

  const newCase = {
    id: `case_${now}`,
    title: `Live Host Review — ${hostData.ip}`,
    description: `Host intelligence investigation opened for ${hostData.ip}. Organization: ${hostData.organization}. Risk score: ${hostData.riskScore}.`,
    status: "open",
    priority,
    createdAt: new Date().toISOString(),
    entityIds,
    assignee: "You",
    reviewer: "Unassigned",
    notes: [
      {
        id: `note_${now}`,
        content: `Initial host intelligence summary: ${hostData.ip} exposed ${hostData.services?.length || 0} service(s) with ${hostData.findings?.length || 0} finding(s).`,
        createdAt: new Date().toLocaleString(),
      },
    ],
    comments: [],
    activity: [
      {
        id: `act_${now}`,
        action: "Case created from Live Host Intelligence",
        author: "You",
        date: new Date().toLocaleString(),
      },
      {
        id: `act_${now + 1}`,
        action: `Linked ${entityIds.length} host-related indicator(s)`,
        author: "System",
        date: new Date().toLocaleString(),
      },
    ],
    source: "live_host",
    ip: hostData.ip,
    score: hostData.riskScore,
  };

  const updatedCases = [newCase, ...allCases];
  saveCases(updatedCases);

  saveGraphInvestigationContext(newCase.id, {
    source: "live_host",
    liveHostData: hostData,
    attackSurfaceGraph: graphPayload,
    pivotTrail: [],
    discoveredPivotIds: [],
    discoveredPivots: [],
  });

  return {
    newCase,
    updatedCases,
  };
}
