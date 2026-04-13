import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPriorityChart({ data }) {
    return (
        <div className="panel p-6">
            <h3 className="text-lg font-semibold text-text">Priority Overview</h3>

            <div className="mt-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}