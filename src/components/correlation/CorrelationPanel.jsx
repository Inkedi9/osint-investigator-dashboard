import { Radar } from "lucide-react";

function severityTone(severity) {
    if (severity === "high") {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (severity === "medium") {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

export default function CorrelationPanel({ findings = [] }) {
    return (
        <div className="panel p-5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-300">
                        <Radar className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Correlation Engine
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-text">
                            Automated Findings
                        </h3>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-surfaceLight px-3 py-1.5 text-sm text-slate-300">
                    {findings.length} correlation{findings.length > 1 ? "s" : ""}
                </div>
            </div>

            {findings.length === 0 ? (
                <div className="mt-4 rounded-xl border border-border bg-surfaceLight p-4 text-sm text-muted">
                    No strong correlation pattern detected in the current graph scope.
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {findings.map((finding) => (
                        <div
                            key={finding.id}
                            className="rounded-2xl border border-border bg-surfaceLight p-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-base font-semibold text-text">
                                        {finding.title}
                                    </p>
                                    <p className="mt-1 text-sm text-muted">
                                        {finding.summary}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-lg border px-3 py-1 text-xs font-medium uppercase ${severityTone(finding.severity)}`}
                                    >
                                        {finding.severity}
                                    </span>

                                    <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                                        {finding.confidence}% confidence
                                    </span>
                                </div>
                            </div>

                            {finding.evidence?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                        Evidence
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {finding.evidence.map((item) => (
                                            <span
                                                key={item.id}
                                                className="rounded-lg border border-border bg-slate-950/50 px-3 py-2 text-xs text-slate-300"
                                            >
                                                {item.label}
                                                {typeof item.riskScore === "number"
                                                    ? ` • Risk ${item.riskScore}`
                                                    : ""}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {finding.recommendedAction && (
                                <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                                    <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                        Recommended Action
                                    </p>
                                    <p className="mt-2 text-sm text-slate-300">
                                        {finding.recommendedAction}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}