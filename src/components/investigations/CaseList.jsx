import CaseCard from "./CaseCard";

export default function CaseList({ cases }) {
    if (!cases.length) {
        return (
            <div className="panel p-6 text-sm text-muted">
                No investigation cases available.
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {cases.map((item) => (
                <CaseCard key={item.id} item={item} />
            ))}
        </div>
    );
}