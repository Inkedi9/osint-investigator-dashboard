import { Clock3 } from "lucide-react";

export default function PivotHistoryPanel({ history = [] }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
            <div className="flex items-center gap-2 mb-4">
                <Clock3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Investigation Path</h3>
            </div>

            {history.length === 0 ? (
                <div className="text-xs text-slate-400">
                    No pivot activity yet. Expand nodes or add entities to build the trail.
                </div>
            ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                        >
                            <p className="text-xs font-medium text-white">
                                {item.action} → <span className="text-cyan-400">{item.entity?.label}</span>
                            </p>

                            {item.sourceEntity && (
                                <p className="mt-1 text-[11px] text-slate-400">
                                    From: {item.sourceEntity.label}
                                </p>
                            )}

                            <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
                                {new Date(item.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}