import { useState } from "react";
import { scanAttackSurface } from "../lib/mockApi";
import { useNavigate } from "react-router-dom";
import { buildAttackSurfaceGraph } from "../lib/attackSurfaceGraph";
import { createCaseFromAttackSurface } from "../utils/caseActions";
import { useToast } from "../components/ui/ToastProvider";

function scoreTone(score) {
    if (score >= 80) {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (score >= 60) {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

function severityTone(severity) {
    if (severity === "high") {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (severity === "medium") {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-slate-500/30 bg-slate-500/10 text-slate-300";
}

export default function AttackSurfacePage() {
    const [domain, setDomain] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { pushToast } = useToast();


    const handleScan = async () => {
        if (!domain.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await scanAttackSurface(domain.trim());
            setData(result);
        } catch (err) {
            console.error("Attack surface scan failed:", err);
            setError("Failed to scan attack surface.");
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenInGraph = () => {
        if (!data || !domain) return;

        const graphPayload = buildAttackSurfaceGraph(domain.trim(), data);

        navigate("/graph", {
            state: {
                source: "attack-surface",
                attackSurfaceGraph: graphPayload,
                focusNodeId: graphPayload.focusNodeId,
            },
        });
    };

    const handleCreateCase = () => {
        if (!data) return;

        try {
            const { newCase } = createCaseFromAttackSurface(data);

            pushToast({
                type: "success",
                title: "Case created",
                message: `${newCase.title} added to investigations.`,
            });

            navigate("/investigations");
        } catch (err) {
            console.error("Failed to create case from attack surface:", err);

            pushToast({
                type: "error",
                title: "Case creation failed",
                message: "Unable to create investigation from attack surface scan.",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">
                    Attack Surface
                </p>
                <h2 className="mt-2 text-3xl font-bold text-text">
                    Attack Surface Scanner
                </h2>
                <p className="mt-2 text-sm text-muted">
                    Simulate domain exposure analysis, related assets, and infrastructure findings.
                </p>
            </div>

            <div className="panel flex flex-col gap-4 p-4 md:flex-row md:items-center">
                <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
                />

                <button
                    onClick={handleScan}
                    disabled={isLoading}
                    className="rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Scanning..." : "Scan Surface"}
                </button>
                <button
                    onClick={handleOpenInGraph}
                    disabled={!data}
                    className="rounded-xl border border-purple-500/30 bg-purple-500/15 px-5 py-3 text-sm font-medium text-purple-300 transition hover:bg-purple-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Open in Graph
                </button>
                <button
                    onClick={handleCreateCase}
                    disabled={!data}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Create Case
                </button>
            </div>

            {error && (
                <div className="panel p-4 text-sm text-red-300">
                    {error}
                </div>
            )}

            {data && (
                <>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="panel p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-muted">Domain</p>
                            <p className="mt-2 text-lg font-semibold text-text">{data.domain}</p>
                        </div>

                        <div className="panel p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-muted">Surface Score</p>
                            <div className="mt-2">
                                <span className={`rounded-lg border px-3 py-1 text-sm font-medium ${scoreTone(data.score)}`}>
                                    {data.score}
                                </span>
                            </div>
                        </div>

                        <div className="panel p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-muted">Subdomains</p>
                            <p className="mt-2 text-lg font-semibold text-text">{data.subdomains.length}</p>
                        </div>

                        <div className="panel p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-muted">Assets</p>
                            <p className="mt-2 text-lg font-semibold text-text">{data.assets.length}</p>
                        </div>
                    </div>

                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">Assessment Summary</h3>
                        <p className="mt-3 text-sm leading-6 text-muted">{data.summary}</p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-6">
                            <div className="panel p-5">
                                <h3 className="text-lg font-semibold text-text">Discovered Subdomains</h3>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {data.subdomains.map((subdomain) => (
                                        <span
                                            key={subdomain}
                                            className="rounded-lg border border-border bg-surfaceLight px-3 py-2 text-sm text-slate-300"
                                        >
                                            {subdomain}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="panel p-5">
                                <h3 className="text-lg font-semibold text-text">Assets</h3>
                                <div className="mt-4 space-y-3">
                                    {data.assets.map((asset) => (
                                        <div
                                            key={asset.id}
                                            className="rounded-xl border border-border bg-surfaceLight p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-text">
                                                        {asset.value}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted">
                                                        {asset.hostname} • {asset.provider} • {asset.country}
                                                    </p>
                                                </div>

                                                <span className={`rounded-lg border px-3 py-1 text-xs ${scoreTone(asset.riskScore)}`}>
                                                    Risk {asset.riskScore}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {asset.ports.map((port) => (
                                                    <span
                                                        key={port}
                                                        className="rounded-full border border-border px-3 py-1 text-xs text-slate-300"
                                                    >
                                                        Port {port}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="panel p-5">
                                <h3 className="text-lg font-semibold text-text">Findings</h3>
                                <div className="mt-4 space-y-3">
                                    {data.findings.map((finding) => (
                                        <div
                                            key={finding.id}
                                            className="rounded-xl border border-border bg-surfaceLight p-4"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-sm font-semibold text-text">
                                                    {finding.title}
                                                </p>
                                                <span className={`rounded-lg border px-3 py-1 text-xs ${severityTone(finding.severity)}`}>
                                                    {finding.severity}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-muted">
                                                {finding.description}
                                            </p>

                                            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-cyan-400">
                                                {finding.category}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="panel p-5">
                                <h3 className="text-lg font-semibold text-text">Category Breakdown</h3>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {Object.entries(data.categories).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="rounded-xl border border-border bg-surfaceLight p-3"
                                        >
                                            <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                                {key}
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-text">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}