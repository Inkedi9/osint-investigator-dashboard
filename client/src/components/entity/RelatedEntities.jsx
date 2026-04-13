import { useNavigate } from "react-router-dom";
import Card from "../common/Card";

export default function RelatedEntities({ entities }) {
    const navigate = useNavigate();

    return (
        <Card>
            <h3 className="text-lg font-semibold text-text">Related Entities</h3>

            <div className="mt-4 space-y-3">
                {entities.length > 0 ? (
                    entities.map((ent) => (
                        <div
                            key={ent.id}
                            onClick={() => navigate(`/entity/${ent.id}`)}
                            className="cursor-pointer rounded-xl border border-border bg-surfaceLight p-4 transition hover:border-accent/30 hover:bg-surface"
                        >
                            <p className="text-xs uppercase tracking-[0.18em] text-muted">
                                {ent.type}
                            </p>
                            <p className="mt-1 font-semibold text-text">{ent.value}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted">No related entities found.</p>
                )}
            </div>
        </Card>
    );
}