import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import SearchResultsList from "../components/search/SearchResultsList";
import { searchEntities } from "../lib/mockApi";

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const queryFromUrl = searchParams.get("q") || "";
    const typeFromUrl = searchParams.get("type") || "domain";

    const runSearch = async ({ query, type }) => {
        setIsLoading(true);
        setError(null);

        try {
            const filtered = await searchEntities(query, {
                type,
            });

            setResults(filtered);
        } catch (err) {
            console.error("Search failed:", err);
            setError("Failed to load search results.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = ({ query, type }) => {
        setSearchParams({
            q: query,
            type,
        });
    };

    useEffect(() => {
        if (queryFromUrl.trim()) {
            runSearch({
                query: queryFromUrl,
                type: typeFromUrl,
            });
        } else {
            setResults([]);
            setError(null);
        }
    }, [queryFromUrl, typeFromUrl]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text">
                    OSINT Search Workspace
                </h2>
                <p className="text-sm text-muted">
                    Investigate domains, IPs, emails, usernames, and related infrastructure.
                </p>
            </div>

            <SearchBar
                onSearch={handleSearch}
                initialQuery={queryFromUrl}
                initialType={typeFromUrl}
            />

            <SearchResultsList
                results={results}
                isLoading={isLoading}
                error={error}
                hasActiveSearch={!!queryFromUrl.trim()}
            />
        </div>
    );
}