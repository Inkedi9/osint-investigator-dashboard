import SearchResultCard from "./SearchResultCard";

export default function SearchResultsList({ results }) {
    if (!results.length) {
        return (
            <div className="panel p-6 text-center text-muted">
                No results yet. Start an investigation.
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {results.map((entity) => (
                <SearchResultCard key={entity.id} entity={entity} />
            ))}
        </div>
    );
}