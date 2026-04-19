import { Brain, ShieldAlert, Sparkles } from "lucide-react";

function postureClasses(posture) {
    if (posture === "Critical") {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (posture === "Elevated") {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    if (posture === "Moderate") {
        return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

export default function AIAnalystPanel({ assessment }) {
    if (!assessment) return null;

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                        <Brain className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            AI Analyst
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-text">
                            Automated Assessment
                        </h3>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`rounded-lg border px-3 py-1 text-xs font-medium ${postureClasses(assessment.posture)}`}>
                    {assessment.posture} posture
                </span>

                <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300">
                    Confidence: {assessment.confidence}
                </span>

                <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300">
                    Avg Risk: {assessment.avgRisk}
                </span>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-cyan-400" />
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Assessment
                    </p>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-200">
                    {assessment.summary}
                </p>

                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Threat Category: {assessment.category}
                </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Suggested Next Steps
                    </p>
                </div>

                <div className="mt-3 space-y-2">
                    {assessment.suggestions.map((item, index) => (
                        <p key={`${item}-${index}`} className="text-sm leading-6 text-slate-300">
                            • {item}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}