import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import SearchResultsList from "../components/search/SearchResultsList";
import { mockEntities } from "../data/mockEntities";

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const queryFromUrl = searchParams.get("q") || "";
    const typeFromUrl = searchParams.get("type") || "domain";

    const runSearch = ({ query, type }) => {
        const filtered = mockEntities.filter(
            (item) =>
                item.type === type &&
                item.value.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
    };

    const handleSearch = ({ query, type }) => {
        setSearchParams({
            q: query,
            type,
        });

        runSearch({ query, type });
    };

    useEffect(() => {
        if (queryFromUrl.trim()) {
            runSearch({
                query: queryFromUrl,
                type: typeFromUrl,
            });
        } else {
            setResults([]);
        }
    }, [queryFromUrl, typeFromUrl]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text">
                    OSINT Search Workspace
                </h2>
                <p className="text-sm text-muted">
                    Investigate domains, IPs, emails, and usernames.
                </p>
            </div>

            <SearchBar
                onSearch={handleSearch}
                initialQuery={queryFromUrl}
                initialType={typeFromUrl}
            />

            <SearchResultsList results={results} />
        </div>
    );
}