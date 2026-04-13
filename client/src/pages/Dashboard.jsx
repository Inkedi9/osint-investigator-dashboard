import { useEffect, useState } from "react";
import { mockCases } from "../data/mockCases";
import { mockEntities } from "../data/mockEntities";
import DashboardStatusChart from "../components/dashboard/DashboardStatusChart";
import DashboardPriorityChart from "../components/dashboard/DashboardPriorityChart";
import {
    getDashboardMetrics,
    getRecentActivity,
    getStatusDistribution,
    getPriorityDistribution,
} from "../utils/dashboardMetrics";

export default function Dashboard() {
    const [metrics, setMetrics] = useState(() =>
        getDashboardMetrics(mockCases, mockEntities)
    );
    const [recentActivity, setRecentActivity] = useState(() =>
        getRecentActivity(
            getDashboardMetrics(mockCases, mockEntities).cases,
            mockEntities
        )
    );

    useEffect(() => {
        const refreshedMetrics = getDashboardMetrics(mockCases, mockEntities);
        setMetrics(refreshedMetrics);
        setRecentActivity(getRecentActivity(refreshedMetrics.cases, mockEntities));
    }, []);

    const statusData = getStatusDistribution(metrics.cases);
    const priorityData = getPriorityDistribution(metrics.cases);

    const topPriorityCase =
        metrics.cases.find((item) => item.priority === "High") || metrics.cases[0];

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">
                    Dashboard
                </p>
                <h2 className="mt-2 text-3xl font-bold text-text">
                    OSINT Investigation Overview
                </h2>
                <p className="mt-2 text-sm text-muted">
                    Centralized workspace for entity analysis, risk scoring, and case tracking.
                </p>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: "Open Investigations", value: metrics.openInvestigations },
                    { label: "Tracked Entities", value: metrics.trackedEntities },
                    { label: "High Risk Findings", value: metrics.highRiskFindings },
                    { label: "Sources Queried", value: metrics.sourcesQueried },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="panel rounded-2xl p-5 transition duration-200 hover:border-accent/20 hover:shadow-glow"
                    >
                        <p className="text-sm text-muted">{item.label}</p>
                        <h3 className="mt-3 text-4xl font-bold tracking-tight text-text">
                            {item.value}
                        </h3>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <DashboardStatusChart data={statusData} />
                <DashboardPriorityChart data={priorityData} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <div className="panel p-6">
                    <h3 className="text-lg font-semibold text-text">Recent Activity</h3>

                    <div className="mt-4 space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-border bg-surfaceLight px-4 py-3 text-sm text-slate-300"
                                >
                                    <p>{item.label}</p>
                                    <p className="mt-1 text-xs text-muted">{item.date}</p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-border bg-surfaceLight px-4 py-3 text-sm text-muted">
                                No activity yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="panel p-6">
                    <h3 className="text-lg font-semibold text-text">Analyst Status</h3>

                    <div className="mt-4 space-y-4">
                        <div className="rounded-xl border border-border bg-surfaceLight p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-warning">
                                Priority
                            </p>
                            <p className="mt-2 text-lg font-semibold text-text">
                                {topPriorityCase ? topPriorityCase.title : "No active case"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-surfaceLight p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-accent">
                                Mode
                            </p>
                            <p className="mt-2 text-lg font-semibold text-text">
                                Demo Dataset Active
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-surfaceLight p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-success">
                                Coverage
                            </p>
                            <p className="mt-2 text-lg font-semibold text-text">
                                {metrics.trackedEntities} entities under review
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}