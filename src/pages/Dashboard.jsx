import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    AlertTriangle,
    BellRing,
    Briefcase,
    Radar,
    ShieldAlert,
} from "lucide-react";
import { mockCases } from "../data/mockCases";
import { mockEntities } from "../data/mockEntities";
import DashboardStatusChart from "../components/dashboard/DashboardStatusChart";
import DashboardPriorityChart from "../components/dashboard/DashboardPriorityChart";
import {
    getDashboardMetrics,
    getStatusDistribution,
    getPriorityDistribution,
} from "../utils/dashboardMetrics";
import LiveHostIntel from "../components/osint/LiveHostIntel";
import { loadCases } from "../utils/caseStorage";
import { getGraphInvestigationContext } from "../utils/graphInvestigationContext";
import { useNavigate } from "react-router-dom";
import DashboardThreatScoreChart from "../components/dashboard/DashboardThreatScoreChart";
import DashboardAlertsSeverityChart from "../components/dashboard/DashboardAlertsSeverityChart";
import DashboardCorrelationsChart from "../components/dashboard/DashboardCorrelationsChart";
import {
    getThreatScoreDistribution,
    getAlertsBySeverity,
    getCorrelationsByCase,
} from "../utils/dashboardAdvancedMetrics";

function kpiTone(type) {
    if (type === "danger") return "border-red-500/30 bg-red-500/10 text-red-300";
    if (type === "warning") return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    if (type === "info") return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    return "border-border bg-surfaceLight text-slate-300";
}

function DashboardStatCard({ icon, label, value, tone = "default" }) {
    return (
        <div className="panel rounded-2xl p-5 transition duration-200 hover:border-accent/20 hover:shadow-glow">
            <div className="flex items-center gap-2 text-sm text-muted">
                {icon}
                <span>{label}</span>
            </div>

            <h3 className="mt-3 text-4xl font-bold tracking-tight text-text">
                {value}
            </h3>

            <div className={`mt-3 inline-flex rounded-lg border px-3 py-1 text-xs font-medium ${kpiTone(tone)}`}>
                {label}
            </div>
        </div>
    );
}

function severityTone(priority) {
    const normalized = String(priority || "").toLowerCase();

    if (normalized === "high") {
        return "text-red-300";
    }

    if (normalized === "medium") {
        return "text-amber-300";
    }

    return "text-emerald-300";
}

function getThreatBucket(score = 0) {
    if (score >= 85) return "Critical";
    if (score >= 70) return "High";
    if (score >= 45) return "Moderate";
    return "Low";
}

function caseHasAlertSeverity(item, severity) {
    const alerts = item.graphContext?.simulatedAlerts || [];
    return alerts.some(
        (alert) => String(alert.severity || "low").toLowerCase() === String(severity).toLowerCase()
    );
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [cases, setCases] = useState(() => loadCases(mockCases));

    const [interactiveFilters, setInteractiveFilters] = useState({
        threatBucket: "",
        alertSeverity: "",
    });

    useEffect(() => {
        setCases(loadCases(mockCases));
    }, []);

    const enrichedCases = useMemo(() => {
        return cases.map((item) => {
            const graphContext = getGraphInvestigationContext(item.id) || {};

            return {
                ...item,
                graphContext,
                threatScore: graphContext?.threatScore?.score || 0,
                threatLevel: graphContext?.threatScore?.level || "Not available",
                correlations: (graphContext?.correlationFindings || []).length,
                alerts: (graphContext?.simulatedAlerts || []).length,
                pivots: (graphContext?.discoveredPivots || []).length,
                updatedAt: graphContext?.updatedAt || item.createdAt,
            };
        });
    }, [cases]);

    const filteredExecutiveCases = useMemo(() => {
        let result = [...enrichedCases];

        if (interactiveFilters.threatBucket) {
            result = result.filter(
                (item) => getThreatBucket(item.threatScore || 0) === interactiveFilters.threatBucket
            );
        }

        if (interactiveFilters.alertSeverity) {
            result = result.filter((item) =>
                caseHasAlertSeverity(item, interactiveFilters.alertSeverity)
            );
        }

        return result;
    }, [enrichedCases, interactiveFilters]);

    const metrics = useMemo(() => {
        const baseMetrics = getDashboardMetrics(enrichedCases, mockEntities);

        const totalCases = enrichedCases.length;
        const openCases = enrichedCases.filter(
            (item) => String(item.status || "").toLowerCase() === "open"
        ).length;
        const highPriorityCases = enrichedCases.filter(
            (item) => String(item.priority || "").toLowerCase() === "high"
        ).length;
        const totalAlerts = enrichedCases.reduce((sum, item) => sum + item.alerts, 0);
        const totalCorrelations = enrichedCases.reduce((sum, item) => sum + item.correlations, 0);

        const avgThreatScore =
            totalCases > 0
                ? Math.round(
                    enrichedCases.reduce((sum, item) => sum + (item.threatScore || 0), 0) /
                    totalCases
                )
                : 0;

        return {
            ...baseMetrics,
            totalCases,
            openCases,
            highPriorityCases,
            totalAlerts,
            totalCorrelations,
            avgThreatScore,
        };
    }, [enrichedCases]);

    const statusData = useMemo(() => getStatusDistribution(enrichedCases), [enrichedCases]);
    const priorityData = useMemo(() => getPriorityDistribution(enrichedCases), [enrichedCases]);

    const threatScoreData = useMemo(
        () => getThreatScoreDistribution(enrichedCases),
        [enrichedCases]
    );

    const alertsSeverityData = useMemo(
        () => getAlertsBySeverity(enrichedCases),
        [enrichedCases]
    );

    const correlationsByCaseData = useMemo(
        () => getCorrelationsByCase(enrichedCases),
        [enrichedCases]
    );

    const topRiskCases = useMemo(() => {
        return [...filteredExecutiveCases]
            .sort((a, b) => {
                if ((b.threatScore || 0) !== (a.threatScore || 0)) {
                    return (b.threatScore || 0) - (a.threatScore || 0);
                }

                return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
            })
            .slice(0, 5);
    }, [enrichedCases]);

    const recentActivity = useMemo(() => {
        const allActivity = filteredExecutiveCases.flatMap((item) =>
            (item.activity || []).map((entry) => ({
                ...entry,
                caseId: item.id,
                caseTitle: item.title,
            }))
        );

        return allActivity
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
            .slice(0, 8);
    }, [filteredExecutiveCases]);

    const topPriorityCase =
        enrichedCases.find(
            (item) => String(item.priority || "").toLowerCase() === "high"
        ) || enrichedCases[0];

    const executiveSummary = useMemo(() => {
        if (metrics.totalCases === 0) {
            return "No investigations available yet. Create or enrich a case to populate the command center.";
        }

        if (metrics.avgThreatScore >= 75) {
            return `${metrics.highPriorityCases} high-priority investigations currently require immediate analyst review. Threat concentration is elevated across the active case portfolio.`;
        }

        if (metrics.avgThreatScore >= 45) {
            return `${metrics.openCases} open investigations remain active with moderate threat signals and multiple correlations requiring analyst validation.`;
        }

        return `The current investigation portfolio remains stable, with limited high-confidence risk concentration detected across active cases.`;
    }, [metrics]);

    const handleThreatBucketFilter = (bucket) => {
        setInteractiveFilters((prev) => ({
            ...prev,
            threatBucket: prev.threatBucket === bucket ? "" : bucket,
        }));
    };

    const handleAlertSeverityFilter = (severityLabel) => {
        const normalized = String(severityLabel || "").toLowerCase();

        setInteractiveFilters((prev) => ({
            ...prev,
            alertSeverity: prev.alertSeverity === normalized ? "" : normalized,
        }));
    };

    const handleCorrelationCaseOpen = (caseId) => {
        if (!caseId) return;
        navigate(`/cases/${caseId}`);
    };

    const clearInteractiveFilters = () => {
        setInteractiveFilters({
            threatBucket: "",
            alertSeverity: "",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">
                    Dashboard
                </p>
                <h2 className="mt-2 text-3xl font-bold text-text">
                    OSINT Investigation Command Center
                </h2>
                <p className="mt-2 text-sm text-muted">
                    Centralized workspace for entity analysis, graph-derived risk scoring, alert simulation, and case tracking.
                </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                    Executive Summary
                </p>
                <p className="mt-3 text-sm text-slate-300">
                    {executiveSummary}
                </p>
            </div>

            {(interactiveFilters.threatBucket || interactiveFilters.alertSeverity) && (
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surfaceLight p-4">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted">
                        Active Filters
                    </span>

                    {interactiveFilters.threatBucket && (
                        <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                            Threat: {interactiveFilters.threatBucket}
                        </span>
                    )}

                    {interactiveFilters.alertSeverity && (
                        <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                            Alert: {interactiveFilters.alertSeverity}
                        </span>
                    )}

                    <button
                        onClick={clearInteractiveFilters}
                        className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <DashboardStatCard
                    icon={<Briefcase className="h-4 w-4 text-cyan-300" />}
                    label="Total Cases"
                    value={metrics.totalCases}
                    tone="info"
                />

                <DashboardStatCard
                    icon={<Activity className="h-4 w-4 text-emerald-300" />}
                    label="Open Cases"
                    value={metrics.openCases}
                    tone="default"
                />

                <DashboardStatCard
                    icon={<AlertTriangle className="h-4 w-4 text-red-300" />}
                    label="High Priority"
                    value={metrics.highPriorityCases}
                    tone="danger"
                />

                <DashboardStatCard
                    icon={<BellRing className="h-4 w-4 text-amber-300" />}
                    label="Alerts"
                    value={metrics.totalAlerts}
                    tone="warning"
                />

                <DashboardStatCard
                    icon={<ShieldAlert className="h-4 w-4 text-cyan-300" />}
                    label="Avg Threat"
                    value={metrics.avgThreatScore}
                    tone={
                        metrics.avgThreatScore >= 70
                            ? "danger"
                            : metrics.avgThreatScore >= 45
                                ? "warning"
                                : "info"
                    }
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <DashboardStatusChart data={statusData} />
                <DashboardPriorityChart data={priorityData} />
                <DashboardThreatScoreChart
                    data={threatScoreData}
                    onBarClick={handleThreatBucketFilter}
                />
                <DashboardAlertsSeverityChart
                    data={alertsSeverityData}
                    onSliceClick={handleAlertSeverityFilter}
                />
                <DashboardCorrelationsChart
                    data={correlationsByCaseData}
                    onBarClick={handleCorrelationCaseOpen}
                />
                <LiveHostIntel />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <div className="panel p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-text">Top Risk Investigations</h3>
                            <p className="mt-1 text-sm text-muted">
                                Prioritized cases based on graph-derived threat scoring and simulated alert activity.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs uppercase tracking-[0.15em] text-muted">
                                <tr>
                                    <th className="pb-3">Case</th>
                                    <th className="pb-3">Priority</th>
                                    <th className="pb-3">Threat</th>
                                    <th className="pb-3">Corr</th>
                                    <th className="pb-3">Alerts</th>
                                    <th className="pb-3">Updated</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border">
                                {topRiskCases.length > 0 ? (
                                    topRiskCases.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="cursor-pointer transition hover:bg-surface"
                                            onClick={() => navigate(`/cases/${item.id}`)}
                                        >
                                            <td className="py-3">
                                                <div>
                                                    <p className="font-medium text-text">{item.title}</p>
                                                    <p className="text-xs text-muted">{item.id}</p>
                                                </div>
                                            </td>

                                            <td className={`py-3 font-medium ${severityTone(item.priority)}`}>
                                                {item.priority}
                                            </td>

                                            <td className="py-3 font-semibold text-cyan-300">
                                                {item.threatScore}
                                            </td>

                                            <td className="py-3 text-violet-300">
                                                {item.correlations}
                                            </td>

                                            <td className="py-3 text-amber-300">
                                                {item.alerts}
                                            </td>

                                            <td className="py-3 text-xs text-muted">
                                                {item.updatedAt
                                                    ? new Date(item.updatedAt).toLocaleString()
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-6 text-sm text-muted">
                                            No investigations available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="panel p-6">
                        <h3 className="text-lg font-semibold text-text">Recent Activity</h3>

                        <div className="mt-4 space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="rounded-xl border border-border bg-surfaceLight px-4 py-3 text-sm text-slate-300"
                                    >
                                        <p className="font-medium text-text">{item.action}</p>
                                        <p className="mt-1 text-xs text-cyan-400">{item.caseTitle}</p>
                                        <p className="mt-1 text-xs text-muted">
                                            {item.author} • {item.date}
                                        </p>
                                        {item.content && (
                                            <p className="mt-2 text-sm text-slate-300">{item.content}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-border bg-surfaceLight px-4 py-3 text-sm text-muted">
                                    No activity yet.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="panel p-6">
                        <h3 className="text-lg font-semibold text-text">Analyst Status</h3>

                        <div className="mt-4 space-y-4">
                            <div className="rounded-xl border border-border bg-surfaceLight p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-warning">
                                    Priority Focus
                                </p>
                                <p className="mt-2 text-lg font-semibold text-text">
                                    {topPriorityCase ? topPriorityCase.title : "No active case"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-accent">
                                    Correlation Coverage
                                </p>
                                <p className="mt-2 text-lg font-semibold text-text">
                                    {metrics.totalCorrelations} active findings across investigations
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-success">
                                    Coverage
                                </p>
                                <p className="mt-2 text-lg font-semibold text-text">
                                    {metrics.trackedEntities} entities under review
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                                    Alerting
                                </p>
                                <p className="mt-2 text-lg font-semibold text-text">
                                    {metrics.totalAlerts} simulated alerts in current workspace
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}