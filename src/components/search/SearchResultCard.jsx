import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import Card from "../common/Card";

function getRiskType(score) {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
}

function formatConfidence(value) {
    if (typeof value !== "number") return "N/A";
    return `${Math.round(value * 100)}%`;
}

export default function SearchResultCard({ entity }) {
    const navigate = useNavigate();

    const riskType = getRiskType(entity.riskScore);

    return (
        <div
            onClick={() => navigate(`/entity/${entity.id}`)}
            className="cursor-pointer"
        >
            <Card className="hover:scale-[1.01] transition-transform">
                {/* Top */}
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        {entity.type}
                    </p>

                    <Badge type={riskType}>
                        Risk {entity.riskScore}
                    </Badge>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-lg font-bold text-text">
                    {entity.displayName || entity.value}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-6 text-muted">
                    {entity.description}
                </p>

                {/* OSINT META */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-lg border border-border bg-surfaceLight px-3 py-2 text-slate-300">
                        <span className="text-slate-400">Country:</span>{" "}
                        <span className="text-text">
                            {entity.country || "Unknown"}
                        </span>
                    </div>

                    <div className="rounded-lg border border-border bg-surfaceLight px-3 py-2 text-slate-300">
                        <span className="text-slate-400">Status:</span>{" "}
                        <span className="text-text">
                            {entity.status || "Unknown"}
                        </span>
                    </div>

                    <div className="rounded-lg border border-border bg-surfaceLight px-3 py-2 text-slate-300">
                        <span className="text-slate-400">Confidence:</span>{" "}
                        <span className="text-text">
                            {formatConfidence(entity.confidence)}
                        </span>
                    </div>

                    <div className="rounded-lg border border-border bg-surfaceLight px-3 py-2 text-slate-300">
                        <span className="text-slate-400">Source:</span>{" "}
                        <span className="text-text">
                            {Array.isArray(entity.source)
                                ? entity.source.join(", ")
                                : entity.source || "Unknown"}
                        </span>
                    </div>
                </div>

                {/* Tags */}
                {entity.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {entity.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-accent"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Timeline hints */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>
                        First seen: {entity.firstSeen || "N/A"}
                    </span>
                    <span>
                        Last seen: {entity.lastSeen || "N/A"}
                    </span>
                </div>
            </Card>
        </div>
    );
}