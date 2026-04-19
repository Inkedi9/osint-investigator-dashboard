import { BellRing, Brain, Radar, ShieldAlert } from "lucide-react";

function severityTone(severity) {
    if (severity === "high" || severity === "critical") {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (severity === "medium") {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

export default function CaseSummaryPanel({ graphContext }) {
    const threatScore = graphContext?.threatScore || null;
    const correlationFindings = graphContext?.correlationFindings || [];
    const simulatedAlerts = graphContext?.simulatedAlerts || [];
    const discoveredPivots = graphContext?.discoveredPivots || [];
    const updatedAt = graphContext?.updatedAt || null;

    const topFindings = correlationFindings.slice(0, 3);
    const topAlerts = simulatedAlerts.slice(0, 3);

    return (
        <div className="panel p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-accent">
                        Case Summary
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-text">
                        Investigation Snapshot
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                        Consolidated analyst context from graph enrichment, correlation, and alert simulation.
                    </p>
                </div>

                {updatedAt && (
                    <div className="rounded-lg border border-border bg-surfaceLight px-3 py-2 text-xs text-slate-300">
                        Updated {new Date(updatedAt).toLocaleString()}
                    </div>
                )}
            </div>

            {!threatScore &&
                topFindings.length === 0 &&
                topAlerts.length === 0 &&
                discoveredPivots.length === 0 ? (
                <div className="mt-4 rounded-xl border border-border bg-surfaceLight p-4 text-sm text-muted">
                    No graph-derived summary is available yet. Open the case in Graph View and run enrichment to populate analyst context.
                </div>
            ) : (
                <div className="mt-5 space-y-5">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                            <div className="flex items-center gap-2 text-cyan-300">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-[0.15em]">
                                    Threat Score
                                </span>
                            </div>
                            <p className="mt-3 text-2xl font-bold text-text">
                                {threatScore?.score ?? "--"}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                                {threatScore?.level || "Not available"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                            <div className="flex items-center gap-2 text-violet-300">
                                <Radar className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-[0.15em]">
                                    Correlations
                                </span>
                            </div>
                            <p className="mt-3 text-2xl font-bold text-text">
                                {correlationFindings.length}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                                Engine findings detected
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                            <div className="flex items-center gap-2 text-red-300">
                                <BellRing className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-[0.15em]">
                                    Alerts
                                </span>
                            </div>
                            <p className="mt-3 text-2xl font-bold text-text">
                                {simulatedAlerts.length}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                                Simulated analyst alerts
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                            <div className="flex items-center gap-2 text-amber-300">
                                <Brain className="h-4 w-4" />
                                <span className="text-xs uppercase tracking-[0.15em]">
                                    Pivots
                                </span>
                            </div>
                            <p className="mt-3 text-2xl font-bold text-text">
                                {discoveredPivots.length}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                                Graph-discovered indicators
                            </p>
                        </div>
                    </div>

                    {threatScore?.summary && (
                        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                Threat Assessment
                            </p>
                            <p className="mt-2 text-sm text-slate-300">
                                {threatScore.summary}
                            </p>
                        </div>
                    )}

                    <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                            <div className="flex items-center gap-2">
                                <Radar className="h-4 w-4 text-violet-300" />
                                <p className="text-sm font-semibold text-text">
                                    Top Correlation Findings
                                </p>
                            </div>

                            {topFindings.length === 0 ? (
                                <p className="mt-3 text-sm text-muted">
                                    No correlation findings available yet.
                                </p>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {topFindings.map((finding) => (
                                        <div
                                            key={finding.id}
                                            className="rounded-xl border border-border bg-slate-950/40 p-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-medium text-text">
                                                    {finding.title}
                                                </p>
                                                <span
                                                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium uppercase ${severityTone(finding.severity)}`}
                                                >
                                                    {finding.severity}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-muted">
                                                {finding.summary}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                            <div className="flex items-center gap-2">
                                <BellRing className="h-4 w-4 text-red-300" />
                                <p className="text-sm font-semibold text-text">
                                    Top Simulated Alerts
                                </p>
                            </div>

                            {topAlerts.length === 0 ? (
                                <p className="mt-3 text-sm text-muted">
                                    No alert simulation available yet.
                                </p>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {topAlerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="rounded-xl border border-border bg-slate-950/40 p-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-medium text-text">
                                                    {alert.title}
                                                </p>
                                                <span
                                                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium uppercase ${severityTone(alert.severity)}`}
                                                >
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm text-muted">
                                                {alert.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}