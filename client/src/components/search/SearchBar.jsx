import { useEffect, useState } from "react";

export default function SearchBar({
    onSearch,
    initialQuery = "",
    initialType = "domain",
}) {
    const [query, setQuery] = useState(initialQuery);
    const [type, setType] = useState(initialType);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        setType(initialType);
    }, [initialType]);

    const handleSearch = () => {
        if (!query.trim()) return;
        onSearch({ query: query.trim(), type });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="panel flex flex-col gap-4 p-4 md:flex-row"
        >
            <input
                type="text"
                placeholder="Enter domain, IP, email, username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none"
            >
                <option value="domain">Domain</option>
                <option value="ip">IP</option>
                <option value="email">Email</option>
                <option value="username">Username</option>
            </select>

            <button
                type="submit"
                className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
                Search
            </button>
        </form>
    );
}