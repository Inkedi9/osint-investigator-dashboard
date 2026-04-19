import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import Card from "../common/Card";

function normalizeStatus(status) {
    return String(status || "").trim().toLowerCase();
}

function normalizePriority(priority) {
    return String(priority || "").trim().toLowerCase();
}

function getStatusBadgeType(status) {
    const normalized = normalizeStatus(status);

    if (normalized === "open") return "open";
    if (normalized === "investigating") return "review";
    if (normalized === "in review") return "review";
    if (normalized === "closed") return "closed";

    return "open";
}

function getPriorityBadgeType(priority) {
    const normalized = normalizePriority(priority);

    if (normalized === "high") return "high";
    if (normalized === "medium") return "medium";
    return "low";
}

function formatLabel(value) {
    const normalized = String(value || "").trim().toLowerCase();

    if (!normalized) return "Unknown";
    if (normalized === "open") return "Open";
    if (normalized === "investigating") return "Investigating";
    if (normalized === "in review") return "In Review";
    if (normalized === "closed") return "Closed";
    if (normalized === "high") return "High";
    if (normalized === "medium") return "Medium";
    if (normalized === "low") return "Low";

    return value;
}

function formatCreatedAt(value) {
    if (!value) return "Unknown";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString();
}

export default function CaseCard({ item }) {
    const navigate = useNavigate();

    const statusLabel = formatLabel(item.status);
    const priorityLabel = formatLabel(item.priority);
    const statusType = getStatusBadgeType(item.status);
    const priorityType = getPriorityBadgeType(item.priority);

    return (
        <div
            onClick={() => navigate(`/cases/${item.id}`)}
            className="cursor-pointer"
        >
            <Card className="hover:scale-[1.01] transition-transform">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge type={statusType}>{statusLabel}</Badge>
                            <Badge type={priorityType}>{priorityLabel}</Badge>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold text-text">
                            {item.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span>Case ID: {item.id}</span>
                            <span>Created: {formatCreatedAt(item.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted">
                    {item.description}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="rounded-xl border border-border bg-surfaceLight px-3 py-2 text-slate-300">
                        <span className="text-slate-400">Entities:</span>{" "}
                        <span className="text-text font-medium">
                            {item.entityIds?.length || 0}
                        </span>
                    </div>

                    <div className="rounded-xl border border-border bg-surfaceLight px-3 py-2 text-slate-300">
                        <span className="text-slate-400">Assignee:</span>{" "}
                        <span className="text-text font-medium">
                            {item.assignee || "Unassigned"}
                        </span>
                    </div>

                    <div className="rounded-xl border border-border bg-surfaceLight px-3 py-2 text-slate-300">
                        <span className="text-slate-400">Reviewer:</span>{" "}
                        <span className="text-text font-medium">
                            {item.reviewer || "None"}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}