import { useParams } from "react-router-dom";
import { mockEntities } from "../data/mockEntities";
import RiskScoreCard from "../components/entity/RiskScoreCard";
import RelatedEntities from "../components/entity/RelatedEntities";
import { mockTimeline } from "../data/mockTimeline";
import TimelinePanel from "../components/timeline/TimelinePanel";
import { useState } from "react";
import AddToCaseModal from "../components/investigations/AddToCaseModal";
import Toast from "../components/common/Toast";

export default function EntityPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const { id } = useParams();

    const entity = mockEntities.find((e) => e.id === id);

    if (!entity) {
        return <div className="text-white">Entity not found</div>;
    }

    const relatedEntities = mockEntities.filter((e) =>
        entity.related?.includes(e.id)
    );

    const timelineData = mockTimeline.find(
        (t) => t.entityId === entity.id
    );

    const handleAddSuccess = () => {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
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
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/20 hover:shadow-glow"
                >
                    + Add to Case
                </button>
            </div>

            {/* Main Grid */}
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Left */}
                <div className="space-y-6">
                    {/* Metadata */}
                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">
                            Metadata
                        </h3>
                        <TimelinePanel events={timelineData?.events || []} />

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {Object.entries(entity.metadata || {}).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="rounded-xl border border-border bg-surfaceLight p-3 text-sm text-slate-300"
                                >
                                    <p className="text-xs uppercase tracking-[0.15em] text-muted">{key}</p>
                                    <p className="mt-1 font-medium text-text">
                                        {Array.isArray(value) ? value.join(", ") : value.toString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">Tags</h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {entity.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-lg bg-accent/10 px-3 py-1 text-xs text-accent"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right */}
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