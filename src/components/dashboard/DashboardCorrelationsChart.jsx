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

function getBarColor(value = 0) {
    if (value >= 6) return "#ef4444";
    if (value >= 3) return "#a855f7";
    return "#22d3ee";
}

function getToneClass(value = 0) {
    if (value >= 6) return "border-red-500/30 bg-red-500/10 text-red-300";
    if (value >= 3) return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
}

function CustomTooltip({ active, payload }) {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0]?.payload;
    if (!item) return null;

    return (
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Correlation Cluster
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{item.name}</p>

            <div className="mt-3 flex items-center gap-2">
                <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getBarColor(item.value) }}
                />
                <p className="text-sm text-slate-300">
                    {item.value} finding{item.value > 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}

export default function DashboardCorrelationsChart({ data = [], onBarClick }) {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    return (
        <div className="panel overflow-hidden p-0">
            <div className="border-b border-border bg-gradient-to-r from-violet-500/10 via-transparent to-transparent px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Correlation Engine
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-text">
                            Correlations by Case
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                            Cases generating the highest number of automated correlation findings.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-center">
                        <p className="text-2xl font-bold text-white">{total}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-violet-300">
                            Total Findings
                        </p>
                    </div>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="px-6 py-10">
                    <div className="rounded-2xl border border-border bg-surfaceLight p-6 text-sm text-muted">
                        No correlation data available yet.
                    </div>
                </div>
            ) : (
                <>
                    <div className="px-4 pt-4">
                        <div className="flex flex-wrap gap-2">
                            {data.map((item) => (
                                <button
                                    key={item.caseId || item.name}
                                    onClick={() => onBarClick?.(item.caseId)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-90 ${getToneClass(item.value)}`}
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
                                layout="vertical"
                                margin={{ top: 20, right: 18, left: 12, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#24324a"
                                    horizontal={true}
                                    vertical={false}
                                />

                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#94a3b8"
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                    allowDecimals={false}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#94a3b8"
                                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                                    width={128}
                                />

                                <Tooltip
                                    cursor={{ fill: "rgba(168, 85, 247, 0.06)" }}
                                    content={<CustomTooltip />}
                                />

                                <Bar
                                    dataKey="value"
                                    radius={[0, 10, 10, 0]}
                                    maxBarSize={26}
                                    onClick={(entry) => onBarClick?.(entry?.caseId)}
                                    style={{ cursor: onBarClick ? "pointer" : "default" }}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`${entry.caseId || entry.name}-${index}`}
                                            fill={getBarColor(entry.value)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid gap-3 border-t border-border px-6 py-5 sm:grid-cols-2 xl:grid-cols-3">
                        {data.map((item) => (
                            <button
                                key={`summary-${item.caseId || item.name}`}
                                onClick={() => onBarClick?.(item.caseId)}
                                className="rounded-2xl border border-border bg-surfaceLight p-3 text-left transition hover:bg-surface"
                            >
                                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                    Case
                                </p>
                                <p className="mt-2 line-clamp-2 text-sm font-medium text-text">
                                    {item.name}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-violet-300">
                                    {item.value}
                                </p>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}