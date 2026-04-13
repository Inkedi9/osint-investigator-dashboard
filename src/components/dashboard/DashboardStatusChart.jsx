import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22d3ee", "#f59e0b", "#22c55e"];

export default function DashboardStatusChart({ data }) {
    return (
        <div className="panel p-6">
            <h3 className="text-lg font-semibold text-text">Case Status Distribution</h3>

            <div className="mt-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={95}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}