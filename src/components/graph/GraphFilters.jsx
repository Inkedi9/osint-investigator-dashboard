export default function GraphFilters({ filters, onToggle }) {
    const items = ["domain", "ip", "email", "service", "username"];

    return (
        <div className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Graph Filters</h3>

            <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => {
                    const active = filters.includes(item);

                    return (
                        <button
                            key={item}
                            onClick={() => onToggle(item)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${active
                                    ? "border-accent/30 bg-accent/10 text-accent"
                                    : "border-border bg-surfaceLight text-muted hover:text-text"
                                }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}