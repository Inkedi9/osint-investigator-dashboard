import { useNavigate } from "react-router-dom";
import { mockEntities } from "../../data/mockEntities";

export default function GraphNodeDetails({
    selectedNode,
    onExpand,
    onAddToCase,
    isExpanding = false,
    expandingNodeId = null,
}) {
    const navigate = useNavigate();

    if (!selectedNode) {
        return (
            <div className="panel">
                <p className="text-sm uppercase tracking-[0.25em] text-accent">
                    Entity Details
                </p>
                <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-muted">
                    Select a node to inspect its metadata and pivot options.
                </div>
            </div>
        );
    }

    const isCurrentNodeExpanding = isExpanding && expandingNodeId === selectedNode.id;

    return (
        <div className="panel">
            <p className="text-sm uppercase tracking-[0.25em] text-accent">
                Entity Details
            </p>

            <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Label
                    </p>
                    <p className="mt-2 text-lg font-semibold text-text">
                        {selectedNode.data?.label}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Type
                    </p>
                    <p className="mt-2 text-sm text-cyan-400">
                        {selectedNode.data?.type || "Unknown"}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Risk Score
                    </p>
                    <p className="mt-2 text-sm text-amber-300">
                        {selectedNode.data?.riskScore ?? "N/A"}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Actions
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                        <button
                            onClick={() => onExpand(selectedNode.id)}
                            disabled={isExpanding}
                            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${isExpanding
                                ? "cursor-not-allowed border border-cyan-500/20 bg-cyan-500/10 text-cyan-200/60"
                                : "border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25"
                                }`}
                        >
                            {isCurrentNodeExpanding ? "Enrichment in progress..." : "Expand Node"}
                        </button>

                        <button
                            onClick={() => onAddToCase(selectedNode)}
                            disabled={isExpanding}
                            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${isExpanding
                                ? "cursor-not-allowed border border-purple-500/20 bg-purple-500/10 text-purple-200/60"
                                : "border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25"
                                }`}
                        >
                            Add to Investigation
                        </button>
                        <button
                            onClick={() => navigate(`/entity/${selectedNode.id}`)}
                            disabled={isExpanding}
                            className={`rounded-xl px-4 py-3 text-sm font-medium transition ${isExpanding
                                ? "cursor-not-allowed border border-amber-500/20 bg-amber-500/10 text-amber-200/60"
                                : "border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                                }`}
                        >
                            Open Entity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}