import { useNavigate } from "react-router-dom";
import { mockEntities } from "../../data/mockEntities";

export default function GraphNodeDetails({ selectedNode }) {
    const navigate = useNavigate();

    if (!selectedNode) {
        return (
            <div className="panel p-5 text-sm text-muted">
                Select a node to inspect its details.
            </div>
        );
    }

    const entity = mockEntities.find((e) => e.id === selectedNode.id);

    if (!entity) {
        return (
            <div className="panel p-5 text-sm text-muted">
                No entity details found.
            </div>
        );
    }

    return (
        <div className="panel p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">
                {entity.type}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-text">
                {entity.value}
            </h3>

            <p className="mt-2 text-sm text-muted">{entity.description}</p>

            <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>
                    <span className="text-muted">Risk Score:</span> {entity.riskScore}
                </p>

                {Object.entries(entity.metadata || {}).map(([key, value]) => (
                    <p key={key}>
                        <span className="text-muted">{key}:</span> {Array.isArray(value) ? value.join(", ") : value.toString()}
                    </p>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {entity.tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-lg bg-accent/10 px-3 py-1 text-xs text-accent"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <button
                onClick={() => navigate(`/entity/${entity.id}`)}
                className="mt-5 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/20"
            >
                Open Entity
            </button>
        </div>
    );
}