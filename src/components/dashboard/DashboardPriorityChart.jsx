import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";

function getBarColor(name) {
    if (name === "High") return "#ef4444";
    if (name === "Medium") return "#f59e0b";
    return "#22c55e";
}

function getToneClass(name) {
    if (name === "High") return "border-red-500/30 bg-red-500/10 text-red-300";
    if (name === "Medium") return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0]?.value || 0;
    const color = getBarColor(label);

    return (
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Priority Level
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{label}</p>

            <div className="mt-3 flex items-center gap-2">
                <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                />
                <p className="text-sm text-slate-300">
                    {value} case{value > 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}

export default function DashboardPriorityChart({ data = [] }) {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    return (
        <div className="panel overflow-hidden p-0">
            <div className="border-b border-border bg-gradient-to-r from-amber-500/10 via-transparent to-transparent px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Priority Overview
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-text">
                            Investigation Priority Breakdown
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                            Distribution of investigation cases by analyst-defined priority.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center">
                        <p className="text-2xl font-bold text-white">{total}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-amber-300">
                            Prioritized Cases
                        </p>
                    </div>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="px-6 py-10">
                    <div className="rounded-2xl border border-border bg-surfaceLight p-6 text-sm text-muted">
                        No priority data available yet.
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

                    <div className="h-80 px-3 pb-4 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#24324a"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#94a3b8"
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#94a3b8"
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                    allowDecimals={false}
                                />

                                <Tooltip
                                    cursor={{ fill: "rgba(245, 158, 11, 0.06)" }}
                                    content={<CustomTooltip />}
                                />

                                <Bar
                                    dataKey="value"
                                    radius={[10, 10, 0, 0]}
                                    maxBarSize={64}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`${entry.name}-${index}`}
                                            fill={getBarColor(entry.name)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
}