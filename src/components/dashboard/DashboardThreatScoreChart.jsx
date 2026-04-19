import {
    BarChart,
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from "recharts";

function getBarColor(name) {
    if (name === "Critical") return "#ef4444";
    if (name === "High") return "#f59e0b";
    if (name === "Moderate") return "#22d3ee";
    return "#10b981";
}

function getToneClass(name) {
    if (name === "Critical") return "border-red-500/30 bg-red-500/10 text-red-300";
    if (name === "High") return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    if (name === "Moderate") return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0]?.value || 0;
    const color = getBarColor(label);

    return (
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Threat Bucket
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{label}</p>

            <div className="mt-3 flex items-center gap-2">
                <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                />
                <p className="text-sm text-slate-300">
                    {value} investigation{value > 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}

export default function DashboardThreatScoreChart({ data = [], onBarClick }) {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    return (
        <div className="panel overflow-hidden p-0">
            <div className="border-b border-border bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Threat Score
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-text">
                            Threat Score Distribution
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                            Distribution of investigations by graph-derived threat level.
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
                        No threat score data available yet.
                    </div>
                </div>
            ) : (
                <>
                    <div className="px-4 pt-4">
                        <div className="flex flex-wrap gap-2">
                            {data.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => onBarClick?.(item.name)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-90 ${getToneClass(item.name)}`}
                                >
                                    {item.name}: {item.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-80 px-3 pb-4 pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="threatGridGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.18} />
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>

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
                                    cursor={{ fill: "rgba(34, 211, 238, 0.06)" }}
                                    content={<CustomTooltip />}
                                />

                                <Bar
                                    dataKey="value"
                                    radius={[10, 10, 0, 0]}
                                    maxBarSize={64}
                                    onClick={(entry) => onBarClick?.(entry?.name)}
                                    style={{ cursor: onBarClick ? "pointer" : "default" }}
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