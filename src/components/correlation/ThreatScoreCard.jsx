import { ShieldAlert } from "lucide-react";

export default function ThreatScoreCard({ threatScore }) {
    if (!threatScore) return null;

    return (
        <div className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                        <ShieldAlert className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Threat Score
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-text">
                            Global Risk Assessment
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                            {threatScore.summary}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-border bg-surfaceLight px-5 py-4 text-center">
                        <p className="text-3xl font-bold text-text">
                            {threatScore.score}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                            / 100
                        </p>
                    </div>

                    <span
                        className={`rounded-xl border px-4 py-2 text-sm font-medium ${threatScore.tone}`}
                    >
                        {threatScore.level}
                    </span>
                </div>
            </div>

            {threatScore.factors?.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                        Contributing Factors
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {threatScore.factors.map((factor, index) => (
                            <span
                                key={`${factor}-${index}`}
                                className="rounded-lg border border-border bg-slate-950/50 px-3 py-2 text-xs text-slate-300"
                            >
                                {factor}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}