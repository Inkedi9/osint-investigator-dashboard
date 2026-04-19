import { BellRing } from "lucide-react";

function severityTone(severity) {
    if (severity === "high") {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (severity === "medium") {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

function statusTone(status) {
    if (status === "new") {
        return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    }

    if (status === "triage") {
        return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    }

    return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

function triageTone(status) {
    if (status === "escalated") {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (status === "reviewed") {
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }

    if (status === "dismissed") {
        return "border-slate-500/30 bg-slate-500/10 text-slate-300";
    }

    return "border-slate-700 bg-slate-900/60 text-slate-400";
}

export default function AlertSimulationPanel({
    alerts = [],
    onPushToCase,
    onTriageAlert,
    triageMap = {},
}) {
    return (
        <div className="panel p-5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
                        <BellRing className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Alert Simulation
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-text">
                            Simulated Analyst Queue
                        </h3>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-surfaceLight px-3 py-1.5 text-sm text-slate-300">
                    {alerts.length} alert{alerts.length > 1 ? "s" : ""}
                </div>
            </div>

            {alerts.length === 0 ? (
                <div className="mt-4 rounded-xl border border-border bg-surfaceLight p-4 text-sm text-muted">
                    No simulated alert generated from the current graph scope.
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {alerts.map((alert) => {
                        const currentTriage = triageMap[alert.id]?.status || null;

                        return (
                            <div
                                key={alert.id}
                                className="rounded-2xl border border-border bg-surfaceLight p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-text">
                                            {alert.title}
                                        </p>
                                        <p className="mt-1 text-sm text-muted">
                                            {alert.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-lg border px-3 py-1 text-xs font-medium uppercase ${severityTone(alert.severity)}`}
                                        >
                                            {alert.severity}
                                        </span>

                                        <span
                                            className={`rounded-lg border px-3 py-1 text-xs font-medium uppercase ${statusTone(alert.status)}`}
                                        >
                                            {alert.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-3">
                                    <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                            Source
                                        </p>
                                        <p className="mt-2 text-sm text-text">
                                            {alert.source}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                            Entity
                                        </p>
                                        <p className="mt-2 text-sm text-text break-words">
                                            {alert.entity}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-slate-950/50 p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                            Confidence
                                        </p>
                                        <p className="mt-2 text-sm text-cyan-300">
                                            {alert.confidence}%
                                        </p>
                                    </div>
                                    {currentTriage && (
                                        <div className="mt-3">
                                            <span
                                                className={`rounded-lg border px-3 py-1 text-xs font-medium uppercase ${triageTone(currentTriage)}`}
                                            >
                                                {currentTriage}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {alert.recommendedAction && (
                                    <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                                        <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                            Recommended Action
                                        </p>
                                        <p className="mt-2 text-sm text-slate-300">
                                            {alert.recommendedAction}
                                        </p>
                                    </div>
                                )}
                                {onPushToCase && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => onPushToCase(alert)}
                                            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
                                        >
                                            Push to Case
                                        </button>
                                    </div>
                                )}
                                {onTriageAlert && (
                                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                                        <button
                                            onClick={() => onTriageAlert(alert, "reviewed")}
                                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                                        >
                                            Mark Reviewed
                                        </button>

                                        <button
                                            onClick={() => onTriageAlert(alert, "escalated")}
                                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
                                        >
                                            Escalate
                                        </button>

                                        <button
                                            onClick={() => onTriageAlert(alert, "dismissed")}
                                            className="rounded-lg border border-slate-500/30 bg-slate-500/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-500/20"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}