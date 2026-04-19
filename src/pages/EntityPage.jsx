import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RiskScoreCard from "../components/entity/RiskScoreCard";
import RelatedEntities from "../components/entity/RelatedEntities";
import TimelinePanel from "../components/timeline/TimelinePanel";
import AddToCaseModal from "../components/investigations/AddToCaseModal";
import Toast from "../components/common/Toast";
import { getEntityById, getTimelineByEntity } from "../lib/mockApi";
import { mockEntities } from "../data/mockEntities";

export default function EntityPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [entity, setEntity] = useState(null);
    const [relatedEntities, setRelatedEntities] = useState([]);
    const [timelineEvents, setTimelineEvents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        async function loadEntityPage() {
            setIsLoading(true);
            setError(null);

            try {
                const entityData = await getEntityById(id);

                if (!entityData) {
                    if (!isCancelled) {
                        setEntity(null);
                        setRelatedEntities([]);
                        setTimelineEvents([]);
                        setError("Entity not found");
                    }
                    return;
                }

                const timelineData = await getTimelineByEntity(id);

                const related = mockEntities.filter((item) =>
                    (entityData.related || []).includes(item.id)
                );

                if (!isCancelled) {
                    setEntity(entityData);
                    setTimelineEvents(timelineData || []);
                    setRelatedEntities(related);
                }
            } catch (err) {
                console.error("Failed to load entity page:", err);

                if (!isCancelled) {
                    setError("Failed to load entity details.");
                    setEntity(null);
                    setRelatedEntities([]);
                    setTimelineEvents([]);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadEntityPage();

        return () => {
            isCancelled = true;
        };
    }, [id]);

    const handleAddSuccess = () => {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
    };

    if (isLoading) {
        return (
            <div className="panel p-6">
                <h2 className="text-2xl font-bold text-text">Loading entity...</h2>
                <p className="mt-2 text-sm text-muted">
                    Retrieving OSINT details, timeline, and related indicators.
                </p>
            </div>
        );
    }

    if (error || !entity) {
        return (
            <div className="panel p-6">
                <h2 className="text-2xl font-bold text-text">Entity not found</h2>
                <p className="mt-2 text-sm text-muted">
                    {error || `No entity matches this ID: ${id}`}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-accent">
                    {entity.type}
                </p>

                <h1 className="mt-2 text-3xl font-bold text-text">
                    {entity.value}
                </h1>

                <p className="mt-2 text-sm text-muted">
                    {entity.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/20 hover:shadow-glow"
                    >
                        + Add to Case
                    </button>

                    <button
                        onClick={() =>
                            navigate("/graph", {
                                state: { focusNodeId: entity.id },
                            })
                        }
                        className="rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-4 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/25"
                    >
                        Open in Graph
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">
                            Metadata
                        </h3>

                        <TimelinePanel events={timelineEvents} />

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {Object.entries(entity.metadata || {}).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300"
                                >
                                    <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                        {key}
                                    </p>
                                    <p className="mt-1 font-medium text-text">
                                        {Array.isArray(value)
                                            ? value.join(", ")
                                            : String(value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">Tags</h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {(entity.tags || []).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-lg bg-accent/10 px-3 py-1 text-xs text-accent"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">OSINT Profile</h3>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">Display Name</p>
                                <p className="mt-1 font-medium text-text">{entity.displayName || entity.value}</p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">Country</p>
                                <p className="mt-1 font-medium text-text">{entity.country || "Unknown"}</p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">Status</p>
                                <p className="mt-1 font-medium text-text">{entity.status || "Unknown"}</p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">Confidence</p>
                                <p className="mt-1 font-medium text-text">
                                    {typeof entity.confidence === "number"
                                        ? entity.confidence.toFixed(2)
                                        : "N/A"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">First Seen</p>
                                <p className="mt-1 font-medium text-text">
                                    {entity.firstSeen || "Unknown"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">Last Seen</p>
                                <p className="mt-1 font-medium text-text">
                                    {entity.lastSeen || "Unknown"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                            <p className="text-xs uppercase tracking-[0.15em] text-muted">Source</p>
                            <p className="mt-1 font-medium text-text">
                                {Array.isArray(entity.source)
                                    ? entity.source.join(", ")
                                    : entity.source || "Unknown"}
                            </p>
                        </div>

                        {entity.notes ? (
                            <div className="mt-4 rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">Notes</p>
                                <p className="mt-1 font-medium text-text">{entity.notes}</p>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="space-y-6">
                    <RiskScoreCard score={entity.riskScore} />
                    <RelatedEntities entities={relatedEntities} />
                </div>

                <AddToCaseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    entityId={entity.id}
                    onSuccess={handleAddSuccess}
                />

                <Toast
                    message="Entity successfully added to case."
                    isVisible={toastVisible}
                />
            </div>
        </div>
    );
}