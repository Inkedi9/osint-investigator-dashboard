import SearchResultCard from "./SearchResultCard";

export default function SearchResultsList({
    results = [],
    isLoading = false,
    error = null,
    hasActiveSearch = false,
}) {
    if (isLoading) {
        return (
            <div className="panel p-6 text-center text-muted">
                Searching OSINT dataset...
            </div>
        );
    }

    if (error) {
        return (
            <div className="panel p-6 text-center text-red-300">
                {error}
            </div>
        );
    }

    if (!hasActiveSearch) {
        return (
            <div className="panel p-6 text-center text-muted">
                No results yet. Start an investigation.
            </div>
        );
    }

    if (!results.length) {
        return (
            <div className="panel p-6 text-center text-muted">
                No entities matched the current search.
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