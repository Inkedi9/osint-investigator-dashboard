import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
    Open: "#22d3ee",
    Investigating: "#f59e0b",
    Closed: "#22c55e",
    "In Review": "#a855f7",
};

function getToneClass(name) {
    if (name === "Open") return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    if (name === "Investigating") return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    if (name === "Closed") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    return "border-violet-500/30 bg-violet-500/10 text-violet-300";
}

function CustomTooltip({ active, payload }) {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0]?.payload;
    if (!item) return null;

    return (
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Case Status
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{item.name}</p>

            <div className="mt-3 flex items-center gap-2">
                <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[item.name] || "#94a3b8" }}
                />
                <p className="text-sm text-slate-300">
                    {item.value} case{item.value > 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}

function CenterLabel({ total }) {
    return (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white">{total}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Total Cases
            </p>
        </div>
    );
}

export default function DashboardStatusChart({ data = [] }) {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    return (
        <div className="panel overflow-hidden p-0">
            <div className="border-b border-border bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Case Tracking
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-text">
                            Case Status Distribution
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                            Overview of investigation status across the workspace.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-center">
                        <p className="text-2xl font-bold text-white">{total}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cyan-300">
                            Total Cases
                        </p>
                    </div>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="px-6 py-10">
                    <div className="rounded-2xl border border-border bg-surfaceLight p-6 text-sm text-muted">
                        No case status data available yet.
                    </div>
                </div>
            ) : (
                <>
                    <div className="px-4 pt-4">
                        <div className="flex flex-wrap gap-2">
                            {data.map((item) => (
                                <span
                                    key={item.name}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${getToneClass(item.name)}`}
                                >
                                    {item.name}: {item.value}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 pb-6 pt-4">
                        <div className="relative mx-auto h-72 max-w-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={105}
                                        innerRadius={62}
                                        paddingAngle={4}
                                        stroke="rgba(15, 23, 42, 0.85)"
                                        strokeWidth={3}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`${entry.name}-${index}`}
                                                fill={COLORS[entry.name] || "#94a3b8"}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                            <CenterLabel total={total} />
                        </div>

                        <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {data.map((item) => (
                                <div
                                    key={`legend-${item.name}`}
                                    className="rounded-2xl border border-border bg-surfaceLight p-3 text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-block h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: COLORS[item.name] || "#94a3b8" }}
                                        />
                                        <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                            {item.name}
                                        </p>
                                    </div>

                                    <p className="mt-2 text-2xl font-semibold text-text">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}