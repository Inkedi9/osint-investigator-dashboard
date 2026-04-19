const puppeteer = require("puppeteer");

function buildPdfAiAssessment(linkedEntities = [], reportContext = {}) {
  const discovered = reportContext.discoveredPivots || [];
  const all = [...linkedEntities, ...discovered];

  const avgRisk =
    all.length > 0
      ? Math.round(
          all.reduce((sum, e) => sum + (e.riskScore || 0), 0) / all.length,
        )
      : 0;

  const highRisk = all.filter((e) => (e.riskScore || 0) >= 80).length;

  const confidence = avgRisk >= 75 ? "High" : avgRisk >= 55 ? "Medium" : "Low";

  const posture =
    avgRisk >= 80
      ? "Critical"
      : avgRisk >= 65
        ? "Elevated"
        : avgRisk >= 45
          ? "Moderate"
          : "Low";

  const summary = `AI-assisted assessment identified ${highRisk} high-risk indicators across ${all.length} entities with an average risk score of ${avgRisk}. The current investigation posture is assessed as ${posture.toLowerCase()} with ${confidence.toLowerCase()} confidence.`;

  return {
    avgRisk,
    highRisk,
    confidence,
    posture,
    summary,
  };
}

function getOverallRiskScore(linkedEntities = [], discoveredPivots = []) {
  const all = [...linkedEntities, ...discoveredPivots];

  if (all.length === 0) return 0;

  const total = all.reduce((sum, entity) => sum + (entity.riskScore || 0), 0);
  return Math.round(total / all.length);
}

function getSeverityLabel(score) {
  if (score >= 80) {
    return { label: "HIGH", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" };
  }

  if (score >= 60) {
    return {
      label: "MEDIUM",
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.12)",
    };
  }

  return { label: "LOW", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" };
}

function detectThreatCategory(
  currentCase,
  linkedEntities = [],
  discoveredPivots = [],
) {
  const all = [...linkedEntities, ...discoveredPivots];
  const textBlob = [
    currentCase.title,
    currentCase.description,
    ...all.map((entity) => `${entity.type} ${entity.value || ""}`),
  ]
    .join(" ")
    .toLowerCase();

  if (
    textBlob.includes("phish") ||
    textBlob.includes("login") ||
    textBlob.includes("credential") ||
    textBlob.includes("mail") ||
    all.some((entity) => entity.type === "email")
  ) {
    return "Phishing Infrastructure";
  }

  if (
    textBlob.includes("c2") ||
    textBlob.includes("command") ||
    textBlob.includes("beacon") ||
    textBlob.includes("malware")
  ) {
    return "Possible C2 Activity";
  }

  if (
    all.some((entity) => entity.type === "service") ||
    textBlob.includes("port") ||
    textBlob.includes("server")
  ) {
    return "Suspicious Infrastructure";
  }

  return "General OSINT Investigation";
}

function getCriticalEntities(linkedEntities = [], discoveredPivots = []) {
  return [...linkedEntities, ...discoveredPivots]
    .filter((entity) => (entity.riskScore || 0) >= 80)
    .slice(0, 5);
}

function buildDynamicAnalystSummary(
  currentCase,
  linkedEntities = [],
  reportContext = {},
) {
  const discoveredPivots = reportContext.discoveredPivots || [];
  const totalEntities = linkedEntities.length;
  const totalPivots = discoveredPivots.length;
  const highRiskCount = [...linkedEntities, ...discoveredPivots].filter(
    (entity) => (entity.riskScore || 0) >= 80,
  ).length;
  const category = detectThreatCategory(
    currentCase,
    linkedEntities,
    discoveredPivots,
  );

  return `This case is currently assessed as ${category}. The investigation includes ${totalEntities} linked entities and ${totalPivots} graph-discovered pivots. ${highRiskCount} high-risk indicators were identified during the review. Current case status is ${currentCase.status} with priority set to ${currentCase.priority}. Continued analyst validation is recommended to confirm infrastructure relevance and determine whether newly discovered pivots should be added to the active case scope.`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderThreatScoreSection(reportContext = {}) {
  const threatScore = reportContext.threatScore;

  if (!threatScore) {
    return "";
  }

  const factorsHtml =
    threatScore.factors && threatScore.factors.length > 0
      ? threatScore.factors
          .map(
            (factor) => `
              <span class="factor-chip">${escapeHtml(factor)}</span>
            `,
          )
          .join("")
      : `<p class="muted">No contributing factors recorded.</p>`;

  return `
    <div class="section">
      <div class="section-title">
        <h2>Threat Score</h2>
        <span class="section-kicker">Global Risk Assessment</span>
      </div>

      <div class="threat-score-card">
        <div class="threat-score-side">
          <div class="threat-score-value">${escapeHtml(threatScore.score)}</div>
          <div class="threat-score-max">/ 100</div>
          <div class="threat-score-level">${escapeHtml(threatScore.level)}</div>
        </div>

        <div class="threat-score-content">
          <p>${escapeHtml(threatScore.summary || "")}</p>

          <div class="factor-grid">
            ${factorsHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCorrelationFindingsSection(reportContext = {}) {
  const findings = reportContext.correlationFindings || [];

  if (!findings.length) {
    return "";
  }

  const findingsHtml = findings
    .slice(0, 5)
    .map(
      (finding) => `
        <div class="finding-card">
          <div class="finding-head">
            <div>
              <p class="finding-title">${escapeHtml(finding.title)}</p>
              <p class="finding-summary">${escapeHtml(finding.summary || "")}</p>
            </div>

            <div class="finding-badges">
              <span class="severity-pill severity-${escapeHtml(finding.severity || "low")}">
                ${escapeHtml(finding.severity || "low")}
              </span>
              <span class="confidence-pill">
                ${escapeHtml(finding.confidence || 0)}% confidence
              </span>
            </div>
          </div>

          ${
            finding.evidence && finding.evidence.length > 0
              ? `
                <div class="finding-evidence">
                  <p class="finding-subtitle">Evidence</p>
                  <div class="factor-grid">
                    ${finding.evidence
                      .slice(0, 6)
                      .map(
                        (item) => `
                          <span class="factor-chip">
                            ${escapeHtml(item.label || item.id || "Evidence")}
                            ${
                              typeof item.riskScore === "number"
                                ? ` • Risk ${item.riskScore}`
                                : ""
                            }
                          </span>
                        `,
                      )
                      .join("")}
                  </div>
                </div>
              `
              : ""
          }

          ${
            finding.recommendedAction
              ? `
                <div class="finding-action">
                  <p><strong>Recommended Action:</strong> ${escapeHtml(
                    finding.recommendedAction,
                  )}</p>
                </div>
              `
              : ""
          }
        </div>
      `,
    )
    .join("");

  return `
    <div class="section">
      <div class="section-title">
        <h2>Correlation Findings</h2>
        <span class="section-kicker">Detection Logic</span>
      </div>

      ${findingsHtml}
    </div>
  `;
}

function renderSimulatedAlertsSection(reportContext = {}) {
  const alerts = reportContext.simulatedAlerts || [];

  if (!alerts.length) {
    return "";
  }

  const alertsHtml = alerts
    .slice(0, 6)
    .map(
      (alert) => `
        <div class="alert-card">
          <div class="alert-head">
            <div>
              <p class="finding-title">${escapeHtml(alert.title)}</p>
              <p class="finding-summary">${escapeHtml(alert.description || "")}</p>
            </div>

            <div class="finding-badges">
              <span class="severity-pill severity-${escapeHtml(alert.severity || "low")}">
                ${escapeHtml(alert.severity || "low")}
              </span>
              <span class="status-pill">
                ${escapeHtml(alert.status || "new")}
              </span>
            </div>
          </div>

          <div class="alert-meta-grid">
            <div class="meta-box">
              <p class="meta-box-label">Source</p>
              <p class="meta-box-value">${escapeHtml(alert.source || "System")}</p>
            </div>

            <div class="meta-box">
              <p class="meta-box-label">Entity</p>
              <p class="meta-box-value">${escapeHtml(alert.entity || "Unknown")}</p>
            </div>

            <div class="meta-box">
              <p class="meta-box-label">Confidence</p>
              <p class="meta-box-value">${escapeHtml(alert.confidence || 0)}%</p>
            </div>
          </div>

          ${
            alert.recommendedAction
              ? `
                <div class="finding-action">
                  <p><strong>Recommended Action:</strong> ${escapeHtml(
                    alert.recommendedAction,
                  )}</p>
                </div>
              `
              : ""
          }
        </div>
      `,
    )
    .join("");

  return `
    <div class="section">
      <div class="section-title">
        <h2>Simulated Analyst Alerts</h2>
        <span class="section-kicker">Alert Simulation</span>
      </div>

      ${alertsHtml}
    </div>
  `;
}

function renderAlertTriageSection(reportContext = {}) {
  const triage = reportContext.alertTriage || {};
  const items = Object.values(triage);

  if (!items.length) {
    return "";
  }

  const triageHtml = items
    .map(
      (item) => `
        <div class="finding-card">
          <div class="finding-head">
            <div>
              <p class="finding-title">${escapeHtml(item.title || "Alert")}</p>
              <p class="finding-summary">Severity: ${escapeHtml(
                item.severity || "unknown",
              )}</p>
            </div>

            <div class="finding-badges">
              <span class="status-pill">${escapeHtml(item.status || "unknown")}</span>
            </div>
          </div>

          <p class="finding-summary">
            Updated at ${escapeHtml(
              item.updatedAt
                ? new Date(item.updatedAt).toLocaleString()
                : "unknown time",
            )}
          </p>
        </div>
      `,
    )
    .join("");

  return `
    <div class="section">
      <div class="section-title">
        <h2>Alert Triage Summary</h2>
        <span class="section-kicker">Analyst Decisioning</span>
      </div>

      ${triageHtml}
    </div>
  `;
}

function buildCaseReportHtml(currentCase, linkedEntities, reportContext = {}) {
  const notesHtml =
    currentCase.notes && currentCase.notes.length > 0
      ? currentCase.notes
          .map(
            (note) => `
              <div class="note-card">
                <p class="note-content">${note.content}</p>
                <p class="note-date">${note.createdAt}</p>
              </div>
            `,
          )
          .join("")
      : `<p class="muted">No analyst notes available.</p>`;

  const alertTriageHtml = renderAlertTriageSection(reportContext);

  const entitiesHtml =
    linkedEntities.length > 0
      ? linkedEntities
          .map(
            (entity) => `
              <div class="entity-card">
                <p><strong>Type:</strong> ${entity.type}</p>
                <p><strong>Value:</strong> ${entity.value}</p>
                <p><strong>Risk Score:</strong> ${entity.riskScore}</p>
                <p><strong>Description:</strong> ${entity.description}</p>
              </div>
            `,
          )
          .join("")
      : `<p class="muted">No linked entities available.</p>`;

  const pivotTrailHtml =
    reportContext.pivotTrail && reportContext.pivotTrail.length > 0
      ? reportContext.pivotTrail
          .map(
            (item) => `
              <span class="trail-item">${item}</span>
            `,
          )
          .join(`<span class="trail-separator">→</span>`)
      : `<p class="muted">No pivot trail recorded.</p>`;

  const discoveredPivotsHtml =
    reportContext.discoveredPivots && reportContext.discoveredPivots.length > 0
      ? reportContext.discoveredPivots
          .map(
            (pivot) => `
              <div class="entity-card">
                <p><strong>Type:</strong> ${pivot.type}</p>
                <p><strong>Value:</strong> ${pivot.value}</p>
                <p><strong>Risk Score:</strong> ${pivot.riskScore}</p>
                <p><strong>Status:</strong> New pivot discovered during investigation</p>
              </div>
            `,
          )
          .join("")
      : `<p class="muted">No additional pivots discovered during this session.</p>`;

  const threatCategory = detectThreatCategory(
    currentCase,
    linkedEntities,
    reportContext.discoveredPivots || [],
  );

  const criticalEntities = getCriticalEntities(
    linkedEntities,
    reportContext.discoveredPivots || [],
  );

  const criticalEntitiesHtml =
    criticalEntities.length > 0
      ? criticalEntities
          .map(
            (entity) => `
              <div class="critical-card">
                <p><strong>${entity.type.toUpperCase()}</strong></p>
                <p>${entity.value || entity.id || "Unknown indicator"}</p>
                <p class="critical-risk">Risk Score: ${entity.riskScore}</p>
              </div>
            `,
          )
          .join("")
      : `<p class="muted">No critical entities detected.</p>`;

  const analystSummary =
    reportContext.analystSummary ||
    buildDynamicAnalystSummary(currentCase, linkedEntities, reportContext);

  const graphImageHtml = reportContext.graphImage
    ? `
        <div class="section">
          <div class="section-title">
            <h2>Graph Snapshot</h2>
            <span class="section-kicker">Visual Context</span>
          </div>

          <div class="graph-image-wrap">
            <img src="${reportContext.graphImage}" alt="Graph Snapshot" class="graph-image" />
          </div>
        </div>
      `
    : "";

  const overallRiskScore = getOverallRiskScore(
    linkedEntities,
    reportContext.discoveredPivots || [],
  );

  const severity = getSeverityLabel(overallRiskScore);

  const timelineEvents = [
    ...(currentCase.activity || []),
    ...(currentCase.notes || []).map((note) => ({
      action: "Note added",
      author: note.author || "Analyst",
      date: note.createdAt,
      content: note.content,
    })),
    ...(currentCase.comments || []).map((comment) => ({
      action: "Comment added",
      author: comment.author || "Analyst",
      date: comment.date,
      content: comment.content,
    })),
  ];

  timelineEvents.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  const timelineHtml =
    timelineEvents.length > 0
      ? timelineEvents
          .map(
            (event) => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <p class="timeline-action">${event.action}</p>
                <p class="timeline-meta">
                  ${event.author || "Unknown"} — ${event.date || ""}
                </p>
                ${
                  event.content
                    ? `<p class="timeline-text">${event.content}</p>`
                    : ""
                }
              </div>
            </div>
          `,
          )
          .join("")
      : `<p class="muted">No activity recorded.</p>`;

  const ai = buildPdfAiAssessment(linkedEntities, reportContext);

  const threatScoreHtml = renderThreatScoreSection(reportContext);
  const correlationFindingsHtml =
    renderCorrelationFindingsSection(reportContext);
  const simulatedAlertsHtml = renderSimulatedAlertsSection(reportContext);

  const aiHtml = `
  <div class="section">
    <div class="section-title">
      <h2>AI Analyst Assessment</h2>
      <span class="section-kicker">Automated Analysis</span>
    </div>

    <div class="panel">
      <p><strong>Posture:</strong> ${ai.posture}</p>
      <p><strong>Confidence:</strong> ${ai.confidence}</p>
      <p><strong>Average Risk:</strong> ${ai.avgRisk}</p>

      <p style="margin-top: 10px;">
        ${ai.summary}
      </p>
    </div>
  </div>
`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${currentCase.title} - Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #111827;
            background: linear-gradient(180deg, #fdfdfd 0%, #f8fafc 100%);
            margin: 0;
            padding: 32px;
          }

          .container {
            max-width: 1000px;
            margin: 0 auto;
          }

          .eyebrow {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #0891b2;
            margin-bottom: 8px;
          }

          h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
          }

          h2 {
            margin: 0 0 12px 0;
            font-size: 20px;
          }

          p {
            line-height: 1.6;
            margin: 0 0 8px 0;
          }

          .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 24px;
            background: linear-gradient(135deg, rgba(8,145,178,0.04) 0%, rgba(255,255,255,0) 100%);
            border-radius: 18px;
            padding: 24px;
          }

          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
          }

          .classification-wrap {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
          }

          .classification {
            font-size: 11px;
            font-weight: 700;
            padding: 6px 10px;
            border: 1px solid #ef4444;
            color: #ef4444;
            border-radius: 999px;
            letter-spacing: 0.12em;
          }

          .severity-badge {
            font-size: 12px;
            font-weight: 700;
            padding: 8px 12px;
            border-radius: 999px;
            border: 1px solid transparent;
          }

          .description {
            margin-top: 10px;
          }

          .meta {
            margin-top: 12px;
            font-size: 12px;
            color: #6b7280;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }

          .hero-grid {
            display: grid;
            grid-template-columns: 1.4fr 0.6fr;
            gap: 20px;
            margin-bottom: 28px;
            align-items: start;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 28px;
            align-items: start;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .panel {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 18px;
            background: #f9fafb;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .score-panel,
          .summary-panel {
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 22px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .score-panel {
            background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
          }

          .summary-panel {
            background: #f9fafb;
          }

          .summary-panel p {
            max-width: 100%;
            word-break: break-word;
          }

          .score-value {
            font-size: 42px;
            font-weight: 800;
            line-height: 1;
            margin-top: 10px;
            color: #111827;
          }

          .score-label {
            margin-top: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: #6b7280;
          }

          .mini-stat-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-top: 16px;
            align-items: start;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .mini-stat {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 14px;
            background: #ffffff;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .mini-stat-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: #6b7280;
          }

          .mini-stat-value {
            margin-top: 8px;
            font-size: 22px;
            font-weight: 700;
            color: #111827;
          }

          .section {
            margin-top: 28px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .section-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
            break-after: avoid;
            page-break-after: avoid;
          }

          .section-kicker {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: #0891b2;
          }

          .note-card,
          .entity-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 14px;
            margin-top: 12px;
            background: #ffffff;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .note-content {
            margin-bottom: 8px;
          }

          .note-date,
          .muted,
          .footer {
            color: #6b7280;
            font-size: 13px;
          }

          .trail {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .trail-item {
            display: inline-block;
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 999px;
            background: #f9fafb;
            font-size: 12px;
          }

          .trail-separator {
            color: #6b7280;
            font-size: 12px;
          }

          .graph-image-wrap {
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 14px;
            background: #f9fafb;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .graph-image {
            width: 100%;
            border-radius: 12px;
            display: block;
          }

          .footer {
            margin-top: 36px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
          }

          h1,
          h2,
          .section-title,
          .section-kicker {
            break-after: avoid;
            page-break-after: avoid;
          }

          .threat-score-card {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 18px;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 18px;
            background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .threat-score-side {
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            background: #ffffff;
            padding: 18px;
            text-align: center;
          }

          .threat-score-value {
            font-size: 44px;
            font-weight: 800;
            line-height: 1;
            color: #111827;
          }

          .threat-score-max {
            margin-top: 6px;
            font-size: 12px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #6b7280;
          }

          .threat-score-level {
            margin-top: 12px;
            display: inline-block;
            padding: 8px 12px;
            border-radius: 999px;
            border: 1px solid #0891b2;
            background: rgba(8, 145, 178, 0.08);
            color: #0891b2;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .threat-score-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .factor-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
          }

          .factor-chip {
            display: inline-block;
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 999px;
            background: #ffffff;
            font-size: 12px;
            color: #374151;
          }

          .finding-card,
          .alert-card {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            background: #ffffff;
            padding: 16px;
            margin-top: 12px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .finding-head,
          .alert-head {
            display: flex;
            justify-content: space-between;
            gap: 14px;
            align-items: flex-start;
          }

          .finding-title {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: #111827;
          }

          .finding-summary {
            margin-top: 6px;
            font-size: 13px;
            color: #4b5563;
          }

          .finding-badges {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .severity-pill,
          .confidence-pill,
          .status-pill {
            display: inline-block;
            padding: 7px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }

          .severity-high,
          .severity-critical {
            border: 1px solid #ef4444;
            color: #ef4444;
            background: rgba(239, 68, 68, 0.08);
          }

          .severity-medium {
            border: 1px solid #f59e0b;
            color: #f59e0b;
            background: rgba(245, 158, 11, 0.08);
          }

          .severity-low {
            border: 1px solid #10b981;
            color: #10b981;
            background: rgba(16, 185, 129, 0.08);
          }

          .confidence-pill {
            border: 1px solid #0891b2;
            color: #0891b2;
            background: rgba(8, 145, 178, 0.08);
          }

          .status-pill {
            border: 1px solid #7c3aed;
            color: #7c3aed;
            background: rgba(124, 58, 237, 0.08);
          }

          .finding-subtitle {
            margin-top: 14px;
            margin-bottom: 6px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #0891b2;
          }

          .finding-action {
            margin-top: 14px;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid rgba(8, 145, 178, 0.16);
            background: rgba(8, 145, 178, 0.04);
          }

          .alert-meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 14px;
          }

          .meta-box {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: #f9fafb;
            padding: 12px;
          }

          .meta-box-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #6b7280;
          }

          .meta-box-value {
            margin-top: 6px;
            font-size: 13px;
            color: #111827;
            word-break: break-word;
          }

          @media print {
            .hero-grid,
            .grid,
            .section,
            .panel,
            .score-panel,
            .summary-panel,
            .note-card,
            .entity-card,
            .graph-image-wrap,
            .trail,
            .mini-stat-grid,
            .mini-stat {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            h1,
            h2,
            .section-title {
              break-after: avoid;
              page-break-after: avoid;
            }

            .category-badge {
              display: inline-block;
              margin-top: 12px;
              padding: 8px 12px;
              border-radius: 999px;
              border: 1px solid #0891b2;
              color: #0891b2;
              background: rgba(8, 145, 178, 0.08);
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .critical-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px;
              margin-top: 12px;
            }

            .critical-card {
              border: 1px solid #fecaca;
              border-radius: 14px;
              background: #fef2f2;
              padding: 14px;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .critical-risk {
              color: #b91c1c;
              font-weight: 700;
              margin-top: 6px;
            }

            .timeline {
              margin-top: 16px;
              border-left: 2px solid #e5e7eb;
              padding-left: 14px;
            }

            .timeline-item {
              position: relative;
              margin-bottom: 16px;
              break-inside: avoid;
            }

            .timeline-dot {
              position: absolute;
              left: -9px;
              top: 4px;
              width: 10px;
              height: 10px;
              background: #0891b2;
              border-radius: 50%;
            }

            .timeline-content {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              padding: 10px 12px;
            }

            .timeline-action {
              font-weight: 700;
              font-size: 13px;
            }

            .timeline-meta {
              font-size: 11px;
              color: #6b7280;
              margin-top: 2px;
            }

            .timeline-text {
              margin-top: 6px;
              font-size: 12px;
            }

            .ai-panel {
              border: 1px solid #0891b2;
              background: rgba(8, 145, 178, 0.05);
            }
          }
        
        </style>
      </head>
      <body>
        <div class="container">
           <div class="header">
            <div class="header-top">
              <div>
                <div class="eyebrow">OSINT Investigator Dashboard</div>
                <h1>${currentCase.title}</h1>
              </div>

              <div class="classification-wrap">
                <div class="classification">CONFIDENTIAL</div>
                <div
                  class="severity-badge"
                  style="color: ${severity.color}; background: ${severity.bg}; border-color: ${severity.color};"
                >
                  ${severity.label} RISK
                </div>
              </div>
            </div>

            <p class="description">${currentCase.description}</p>

            <div class="meta">
              <span>Case ID: ${currentCase.id}</span>
              <span>Status: ${currentCase.status}</span>
              <span>Priority: ${currentCase.priority}</span>
              <span>Generated: ${new Date().toLocaleString()}</span>
            </div>
          </div>

          <div class="hero-grid">
            <div class="score-panel">
              <div class="section-kicker">Investigation Risk Profile</div>
              <div class="score-value">${overallRiskScore}</div>
              <div class="score-label">Overall Case Risk Score</div>

              <div class="mini-stat-grid">
                <div class="mini-stat">
                  <div class="mini-stat-label">Entities</div>
                  <div class="mini-stat-value">${linkedEntities.length}</div>
                </div>

                <div class="mini-stat">
                  <div class="mini-stat-label">Pivots</div>
                  <div class="mini-stat-value">${(reportContext.discoveredPivots || []).length}</div>
                </div>

                <div class="mini-stat">
                  <div class="mini-stat-label">Notes</div>
                  <div class="mini-stat-value">${currentCase.notes.length}</div>
                </div>

                <div class="mini-stat">
                  <div class="mini-stat-label">Comments</div>
                  <div class="mini-stat-value">${(currentCase.comments || []).length}</div>
                </div>
              </div>
            </div>

            <div class="summary-panel">
              <div class="section-kicker">Executive Summary</div>
              <div class="category-badge">${threatCategory}</div>
              <p style="margin-top: 12px;">${analystSummary}</p>

              <p style="margin-top: 12px;">
                This investigation currently includes <strong>${linkedEntities.length}</strong>
                linked entities and <strong>${(reportContext.discoveredPivots || []).length}</strong>
                graph-discovered pivots. The current severity is assessed as
                <strong>${severity.label}</strong> based on the observed indicators.
              </p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <h2>Risk Overview</h2>
              <span class="section-kicker">Threat Assessment</span>
            </div>
            ${aiHtml}
            <div class="grid">
              <div class="panel">
                <p><strong>Total Entities:</strong> ${linkedEntities.length}</p>
                <p><strong>High Risk:</strong> ${
                  linkedEntities.filter((e) => e.riskScore >= 80).length
                }</p>
                <p><strong>Medium Risk:</strong> ${
                  linkedEntities.filter(
                    (e) => e.riskScore >= 60 && e.riskScore < 80,
                  ).length
                }</p>
                <p><strong>Low Risk:</strong> ${
                  linkedEntities.filter((e) => e.riskScore < 60).length
                }</p>
              </div>
            </div>
          </div>
          ${threatScoreHtml}
          ${correlationFindingsHtml}
          ${simulatedAlertsHtml}
          ${alertTriageHtml}

          <div class="section">
            <div class="section-title">
              <h2>Critical Indicators</h2>
              <span class="section-kicker">Priority Review</span>
            </div>

            <div class="critical-grid">
              ${criticalEntitiesHtml}
            </div>
          </div>

          <div class="section">
            <h2>Investigation Insights</h2>
            <p>
              Additional indicators may have been discovered through graph-based pivoting.
              These pivots expand the investigation scope and provide further context
              around the analyzed entities.
            </p>
          </div>

          <div class="section">
            <div class="section-title">
              <h2>Analyst Notes</h2>
              <span class="section-kicker">Investigation Log</span>
            </div>
            ${notesHtml}
          </div>

          <div class="section">
            <div class="section-title">
              <h2>Linked Entities</h2>
              <span class="section-kicker">Observed Indicators</span>
            </div>
            ${entitiesHtml}
          </div>

          <div class="section">
            <div class="section-title">
              <h2>Investigation Trail</h2>
              <span class="section-kicker">Pivot Path</span>
            </div>
            <div class="trail">
              ${pivotTrailHtml}
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              <h2>Discovered Pivots</h2>
              <span class="section-kicker">Graph Expansion</span>
            </div>
            ${discoveredPivotsHtml}
          </div>

          <div class="section">
            <div class="section-title">
              <h2>Recommended Next Actions</h2>
              <span class="section-kicker">Analyst Guidance</span>
            </div>

            <div class="panel">
              <p>• Prioritize validation of high-risk indicators listed in the Critical Indicators section.</p>
              <p>• Review graph-discovered pivots and decide whether they should be promoted into the formal investigation scope.</p>
              <p>• Correlate suspicious infrastructure, related email indicators, and any exposed services for additional context.</p>
              <p>• Update case disposition, analyst notes, and final confidence assessment after enrichment review.</p>
            </div>
          </div>

          ${graphImageHtml}

          <div class="section">
            <div class="section-title">
              <h2>Investigation Timeline</h2>
              <span class="section-kicker">Activity Log</span>
            </div>

            <div class="timeline">
              ${timelineHtml}
            </div>
          </div>

          <div class="footer">
            <p><strong>Generated by:</strong> OSINT Investigator Dashboard</p>
            <p><strong>Report Type:</strong> Investigation Summary Report</p>
            <p><strong>Handling:</strong> Internal analyst use only</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

async function generateCasePdf(
  currentCase,
  linkedEntities,
  reportContext = {},
) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    const html = buildCaseReportHtml(
      currentCase,
      linkedEntities,
      reportContext,
    );

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = {
  generateCasePdf,
};
