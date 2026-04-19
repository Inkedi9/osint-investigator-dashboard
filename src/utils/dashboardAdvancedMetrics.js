export function getThreatScoreDistribution(cases = []) {
  const buckets = {
    Low: 0,
    Moderate: 0,
    High: 0,
    Critical: 0,
  };

  cases.forEach((item) => {
    const score = item.threatScore || 0;

    if (score >= 85) {
      buckets.Critical += 1;
    } else if (score >= 70) {
      buckets.High += 1;
    } else if (score >= 45) {
      buckets.Moderate += 1;
    } else {
      buckets.Low += 1;
    }
  });

  return Object.entries(buckets).map(([name, value]) => ({
    name,
    value,
  }));
}

export function getAlertsBySeverity(cases = []) {
  const totals = {
    low: 0,
    medium: 0,
    high: 0,
  };

  cases.forEach((item) => {
    const alerts = item.graphContext?.simulatedAlerts || [];

    alerts.forEach((alert) => {
      const severity = String(alert.severity || "low").toLowerCase();

      if (severity === "high" || severity === "critical") {
        totals.high += 1;
      } else if (severity === "medium") {
        totals.medium += 1;
      } else {
        totals.low += 1;
      }
    });
  });

  return [
    { name: "Low", value: totals.low },
    { name: "Medium", value: totals.medium },
    { name: "High", value: totals.high },
  ];
}

export function getCorrelationsByCase(cases = []) {
  return [...cases]
    .map((item) => ({
      name:
        item.title && item.title.length > 24
          ? `${item.title.slice(0, 24)}…`
          : item.title || item.id,
      value: item.correlations || 0,
      caseId: item.id,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}
