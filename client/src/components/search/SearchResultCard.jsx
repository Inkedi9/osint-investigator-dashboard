import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import Card from "../common/Card";

export default function SearchResultCard({ entity }) {
    const navigate = useNavigate();

    const riskType =
        entity.riskScore >= 80
            ? "high"
            : entity.riskScore >= 60
                ? "medium"
                : "low";

    return (
        <div onClick={() => navigate(`/entity/${entity.id}`)} className="cursor-pointer">
            <Card className="hover:scale-[1.01]">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        {entity.type}
                    </p>
                    <Badge type={riskType}>Risk {entity.riskScore}</Badge>
                </div>

                <h3 className="mt-3 text-lg font-bold text-text">{entity.value}</h3>

                <p className="mt-2 text-sm leading-6 text-muted">{entity.description}</p>

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
            </Card>
        </div>
    );
}