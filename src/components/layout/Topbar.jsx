import { useState } from "react";
import { Bell, Plus, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [type, setType] = useState("domain");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        navigate(
            `/search?q=${encodeURIComponent(query.trim())}&type=${encodeURIComponent(type)}`
        );
    };

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
                <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-3">
                    <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                        <SearchIcon size={18} className="text-muted" />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search domain, IP, email, username..."
                            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
                        />

                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="rounded-lg bg-transparent text-sm text-text outline-none"
                        >
                            <option value="domain">Domain</option>
                            <option value="ip">IP</option>
                            <option value="email">Email</option>
                            <option value="username">Username</option>
                        </select>
                    </div>
                </form>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/investigations")}
                        className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/20"
                    >
                        <Plus size={16} />
                        New Case
                    </button>

                    <button className="rounded-xl border border-border bg-surface p-3 text-muted transition hover:text-text">
                        <Bell size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}