import { useMemo, useState } from "react";
import {
    AlertTriangle,
    Building2,
    Globe,
    Radar,
    Server,
    ShieldAlert,
    Waypoints,
} from "lucide-react";
import { fetchHostIntel } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/ToastProvider";
import { buildLiveHostGraph } from "../../lib/liveHostGraph";
import { createCaseFromLiveHost } from "../../utils/caseActions";

function scoreTone(score) {
    if (score >= 80) {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (score >= 60) {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

function findingTone(text = "") {
    const value = String(text).toLowerCase();

    if (
        value.includes("exposed") ||
        value.includes("outdated") ||
        value.includes("externally reachable") ||
        value.includes("critical")
    ) {
        return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (
        value.includes("potential") ||
        value.includes("public") ||
        value.includes("internet") ||
        value.includes("reachable")
    ) {
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
}

function serviceTone(port) {
    if ([22, 3389, 21].includes(port)) {
        return "border-red-500/20 bg-red-500/5";
    }

    if ([80, 443, 8080, 8443].includes(port)) {
        return "border-cyan-500/20 bg-cyan-500/5";
    }

    return "border-border bg-surfaceLight";
}

export default function LiveHostIntel() {
    const [ip, setIp] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scanStage, setScanStage] = useState("");

    const navigate = useNavigate();
    const { pushToast } = useToast();

    const analystSummary = useMemo(() => {
        if (!data) return null;

        const exposedCount = data.services?.length || 0;
        const findingsCount = data.findings?.length || 0;

        if ((data.riskScore || 0) >= 80) {
            return `High-risk host profile detected. ${exposedCount} exposed service(s) and ${findingsCount} analyst finding(s) suggest this asset should be prioritized for infrastructure review.`;
        }

        if ((data.riskScore || 0) >= 60) {
            return `Moderate exposure identified. The host presents ${exposedCount} visible service(s) with multiple indicators worth validating before escalation.`;
        }

        return `Limited risk concentration detected. The host remains observable with ${exposedCount} service(s), but current indicators do not strongly suggest immediate escalation.`;
    }, [data]);

    const handleSearch = async () => {
        if (!ip.trim()) return;

        try {
            setLoading(true);
            setData(null);

            setScanStage("Resolving target...");
            setTimeout(() => setScanStage("Fingerprinting infrastructure..."), 350);
            setTimeout(() => setScanStage("Enumerating exposed services..."), 700);
            setTimeout(() => setScanStage("Computing analyst findings..."), 1050);

            const result = await fetchHostIntel(ip.trim());
            setData(result.data);
            setScanStage("Host intelligence ready");
        } catch (error) {
            console.error("Error fetching intel:", error);
            setScanStage("Failed to retrieve host intelligence");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenInGraph = () => {
        if (!data) return;

        const graphPayload = buildLiveHostGraph(data);

        navigate("/graph", {
            state: {
                source: "live-host",
                attackSurfaceGraph: graphPayload,
                focusNodeId: graphPayload.focusNodeId,
            },
        });
    };

    const handleCreateInvestigation = () => {
        if (!data) return;

        try {
            const { newCase } = createCaseFromLiveHost(data);

            pushToast({
                type: "success",
                title: "Case created",
                message: `${newCase.title} added to investigations.`,
            });

            navigate(`/cases/${newCase.id}`);
        } catch (error) {
            console.error("Failed to create live host case:", error);

            pushToast({
                type: "error",
                title: "Case creation failed",
                message: "Unable to create investigation from host intelligence.",
            });
        }
    };

    return (
        <div className="panel overflow-hidden p-0">
            <div className="border-b border-border bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            Host Intelligence
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-text">
                            Live Host Intelligence
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                            Tactical host-level enrichment for exposed services, infrastructure fingerprinting, and analyst review.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                        <Radar className="h-5 w-5" />
                    </div>
                </div>
            </div>

            <div className="px-6 py-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <input
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="Enter IP (e.g. 8.8.8.8)"
                        className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
                    />

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Scanning..." : "Analyze Host"}
                    </button>
                </div>

                {(loading || scanStage) && (
                    <div className="mt-4 rounded-xl border border-border bg-surfaceLight p-4">
                        <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                            Scan Progress
                        </p>
                        <p className="mt-2 text-sm text-slate-300">{scanStage}</p>

                        {loading && (
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                                <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan-400/70" />
                            </div>
                        )}
                    </div>
                )}

                {data && (
                    <div className="mt-6 space-y-5">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                                <div className="flex items-center gap-2 text-cyan-300">
                                    <Waypoints className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-[0.15em]">
                                        Host
                                    </span>
                                </div>
                                <p className="mt-3 text-lg font-semibold text-text">{data.ip}</p>
                            </div>

                            <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                                <div className="flex items-center gap-2 text-violet-300">
                                    <Building2 className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-[0.15em]">
                                        Organization
                                    </span>
                                </div>
                                <p className="mt-3 text-lg font-semibold text-text">
                                    {data.organization}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                                <div className="flex items-center gap-2 text-amber-300">
                                    <Globe className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-[0.15em]">
                                        Country
                                    </span>
                                </div>
                                <p className="mt-3 text-lg font-semibold text-text">{data.country}</p>
                            </div>

                            <div className="rounded-2xl border border-border bg-surfaceLight p-4">
                                <div className="flex items-center gap-2 text-red-300">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-[0.15em]">
                                        Risk Score
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <span className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${scoreTone(data.riskScore)}`}>
                                        {data.riskScore}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-border bg-surfaceLight p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                                Infrastructure Summary
                                            </p>
                                            <h4 className="mt-2 text-base font-semibold text-text">
                                                Host Profile
                                            </h4>
                                        </div>

                                        <span className="rounded-lg border border-border bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
                                            {data.asn}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl border border-border bg-slate-950/40 p-3">
                                            <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                                ASN
                                            </p>
                                            <p className="mt-2 text-sm font-medium text-text">
                                                {data.asn}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border bg-slate-950/40 p-3">
                                            <p className="text-xs uppercase tracking-[0.15em] text-muted">
                                                Exposed Ports
                                            </p>
                                            <p className="mt-2 text-sm font-medium text-text">
                                                {data.ports.join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    {analystSummary && (
                                        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                                Analyst Summary
                                            </p>
                                            <p className="mt-2 text-sm text-slate-300">
                                                {analystSummary}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-border bg-surfaceLight p-5">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-300" />
                                        <h4 className="text-base font-semibold text-text">
                                            Findings
                                        </h4>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {data.findings.map((finding, index) => (
                                            <div
                                                key={`${finding}-${index}`}
                                                className={`rounded-xl border p-3 text-sm ${findingTone(finding)}`}
                                            >
                                                {finding}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="rounded-2xl border border-border bg-surfaceLight p-5">
                                    <div className="flex items-center gap-2">
                                        <Server className="h-4 w-4 text-red-300" />
                                        <h4 className="text-base font-semibold text-text">
                                            Services
                                        </h4>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {data.services.map((service, index) => (
                                            <div
                                                key={`${service.port}-${index}`}
                                                className={`rounded-xl border p-4 ${serviceTone(service.port)}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-text">
                                                            {service.product}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted">
                                                            Version {service.version}
                                                        </p>
                                                    </div>

                                                    <span className="rounded-lg border border-border bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
                                                        Port {service.port}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-border bg-surfaceLight p-5">
                                    <p className="text-xs uppercase tracking-[0.15em] text-cyan-400">
                                        Quick Actions
                                    </p>

                                    <div className="mt-4 space-y-3">
                                        <button
                                            onClick={handleOpenInGraph}
                                            disabled={!data}
                                            className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Open in Graph
                                        </button>

                                        <button
                                            onClick={handleCreateInvestigation}
                                            disabled={!data}
                                            className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Create Investigation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}