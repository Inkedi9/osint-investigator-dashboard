import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import Card from "../common/Card";

export default function CaseCard({ item }) {
    const navigate = useNavigate();

    const statusType =
        item.status === "Open"
            ? "open"
            : item.status === "In Review"
                ? "review"
                : "closed";

    const priorityType =
        item.priority === "High"
            ? "high"
            : item.priority === "Medium"
                ? "medium"
                : "low";

    return (
        <div onClick={() => navigate(`/cases/${item.id}`)} className="cursor-pointer">
            <Card className="hover:scale-[1.01]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge type={statusType}>{item.status}</Badge>
                            <Badge type={priorityType}>{item.priority}</Badge>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold text-text">{item.title}</h3>
                    </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>

                <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                    <span>Created: {item.createdAt}</span>
                    <span>{item.entityIds.length} linked entities</span>
                </div>
            </Card>
        </div>
    );
}