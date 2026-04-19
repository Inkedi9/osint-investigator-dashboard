import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    ReactFlowProvider,
    useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
    AlertTriangle,
    Eye,
    Globe,
    Mail,
    Maximize2,
    PanelBottom,
    PanelTop,
    Server,
    ShieldAlert,
    User,
    Waypoints,
} from "lucide-react";
import { toPng } from "html-to-image";

function getNodeBorder(type) {
    if (type === "domain") return "1px solid #22d3ee";
    if (type === "ip") return "1px solid #f59e0b";
    if (type === "email") return "1px solid #22c55e";
    if (type === "service") return "1px solid #ef4444";
    if (type === "username") return "1px solid #a855f7";
    return "1px solid #24324a";
}

function getTypeBadgeStyle(type) {
    if (type === "domain") return { background: "rgba(34, 211, 238, 0.15)", color: "#67e8f9" };
    if (type === "ip") return { background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" };
    if (type === "email") return { background: "rgba(34, 197, 94, 0.15)", color: "#4ade80" };
    if (type === "service") return { background: "rgba(239, 68, 68, 0.15)", color: "#f87171" };
    if (type === "username") return { background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" };
    return { background: "rgba(148, 163, 184, 0.12)", color: "#cbd5e1" };
}

function getNodeIcon(type) {
    if (type === "domain") return <Globe className="h-3.5 w-3.5" />;
    if (type === "ip") return <Waypoints className="h-3.5 w-3.5" />;
    if (type === "email") return <Mail className="h-3.5 w-3.5" />;
    if (type === "service") return <Server className="h-3.5 w-3.5" />;
    if (type === "username") return <User className="h-3.5 w-3.5" />;
    return <Globe className="h-3.5 w-3.5" />;
}

function getRiskTone(score) {
    if (score >= 80) {
        return {
            label: "HIGH",
            className: "border border-red-500/30 bg-red-500/15 text-red-300",
        };
    }

    if (score >= 60) {
        return {
            label: "MEDIUM",
            className: "border border-amber-500/30 bg-amber-500/15 text-amber-300",
        };
    }

    return {
        label: "LOW",
        className: "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    };
}

function getEdgeStyle(edge) {
    const label = String(edge.label || "").toLowerCase();

    if (label.includes("resolves")) {
        return {
            style: { stroke: "#22d3ee", strokeWidth: 1.8, strokeDasharray: "6 6" },
            labelStyle: { fill: "#94a3b8", fontSize: 12 },
        };
    }

    if (label.includes("related")) {
        return {
            style: { stroke: "#a78bfa", strokeWidth: 1.6, strokeDasharray: "4 6" },
            labelStyle: { fill: "#c4b5fd", fontSize: 12 },
        };
    }

    if (label.includes("hosts") || label.includes("runs")) {
        return {
            style: { stroke: "#f87171", strokeWidth: 1.8 },
            labelStyle: { fill: "#fca5a5", fontSize: 12 },
        };
    }

    return {
        style: { stroke: "#22d3ee", strokeWidth: 1.5 },
        labelStyle: { fill: "#94a3b8", fontSize: 12 },
    };
}

function buildNodeLabel(node, isExpanding, isOutsideCase) {
    const type = (node.data?.type || "unknown").toUpperCase();
    const label = node.data?.labelText || node.data?.label || node.id;
    const badgeStyle = getTypeBadgeStyle(node.data?.type);
    const riskScore = node.data?.riskScore || 0;
    const riskTone = getRiskTone(riskScore);

    return (
        <div className="min-w-[170px]">
            <div className="mb-2 flex items-start justify-between gap-2">
                <div
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold tracking-[0.18em]"
                    style={badgeStyle}
                >
                    {getNodeIcon(node.data?.type)}
                    <span>{type}</span>
                </div>

                <div
                    className={`rounded-md px-2 py-1 text-[10px] font-semibold ${riskTone.className}`}
                >
                    {riskScore}
                </div>
            </div>

            <div className="text-sm font-semibold text-slate-100 break-words">
                {label}
            </div>

            <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                <ShieldAlert className="h-3 w-3" />
                <span>{riskTone.label} risk</span>
            </div>

            {isExpanding && (
                <div className="mt-2 text-[11px] text-cyan-400">
                    Enrichment in progress...
                </div>
            )}
            {isOutsideCase && (
                <div className="mt-2 text-[10px] uppercase tracking-[0.15em] text-amber-300">
                    New pivot
                </div>
            )}
        </div>
    );
}

function getColumnY(index, spacing = 135, start = -80) {
    return start + index * spacing;
}

function layoutAttackSurfaceNodes(nodes) {
    if (!nodes?.length) return nodes;

    const isAttackSurfaceGraph = nodes.some(
        (node) => node.data?.source === "attack_surface"
    );

    if (!isAttackSurfaceGraph) {
        return nodes;
    }

    const rootNode = nodes.find(
        (node) =>
            node.data?.source === "attack_surface" &&
            node.data?.type === "domain" &&
            node.data?.category !== "subdomain"
    );

    const subdomains = nodes.filter(
        (node) =>
            node.id !== rootNode?.id &&
            node.data?.type === "domain"
    );

    const ips = nodes.filter((node) => node.data?.type === "ip");
    const services = nodes.filter((node) => node.data?.type === "service");

    const findingServices = services.filter(
        (node) => node.data?.category === "finding"
    );

    const realServices = services.filter(
        (node) => node.data?.category !== "finding"
    );

    return nodes.map((node) => {
        if (rootNode && node.id === rootNode.id) {
            return {
                ...node,
                position: { x: 0, y: 0 },
            };
        }

        const subdomainIndex = subdomains.findIndex((item) => item.id === node.id);
        if (subdomainIndex !== -1) {
            return {
                ...node,
                position: {
                    x: -320,
                    y: getColumnY(subdomainIndex, 125, -60),
                },
            };
        }

        const findingIndex = findingServices.findIndex((item) => item.id === node.id);
        if (findingIndex !== -1) {
            return {
                ...node,
                position: {
                    x: -620,
                    y: getColumnY(findingIndex, 135, -60),
                },
            };
        }

        const ipIndex = ips.findIndex((item) => item.id === node.id);
        if (ipIndex !== -1) {
            return {
                ...node,
                position: {
                    x: 320,
                    y: getColumnY(ipIndex, 145, -70),
                },
            };
        }

        const serviceIndex = realServices.findIndex((item) => item.id === node.id);
        if (serviceIndex !== -1) {
            return {
                ...node,
                position: {
                    x: 620,
                    y: getColumnY(serviceIndex, 120, -40),
                },
            };
        }

        return node;
    });
}

function GraphCanvasInner({
    nodes,
    edges,
    onNodeClick,
    expandSignal,
    onDebugToast,
    expandingNodeId,
    newlyAddedNodeIds = [],
    discoveryCount,
    graphInsights,
    selectedNodeId,
    focusNodeId,
    isCaseMode,
    caseEntityIds = [],
    onGraphSnapshotReady,
}) {

    const { fitView, setCenter } = useReactFlow();
    const [showInsights, setShowInsights] = useState(true);
    const [showLegend, setShowLegend] = useState(true);
    const graphExportRef = useRef(null);

    const styledNodes = useMemo(() => {
        const layoutedNodes = layoutAttackSurfaceNodes(nodes);

        return layoutedNodes.map((node) => {
            const isExpanding = node.id === expandingNodeId;
            const isNew = newlyAddedNodeIds.includes(node.id);
            const isOutsideCase =
                isCaseMode &&
                !caseEntityIds.includes(node.id);
            const isSelected = node.id === selectedNodeId;
            const riskScore = node.data?.riskScore || 0;

            return {
                ...node,
                data: {
                    ...node.data,
                    labelText: node.data?.labelText || node.data?.label,
                    label: buildNodeLabel(node, isExpanding, isOutsideCase),
                },
                style: {
                    background: isSelected ? "#1b2940" : isExpanding ? "#18263a" : "#121a2a",
                    color: "#e6eef8",
                    border: isSelected
                        ? "1px solid rgba(103, 232, 249, 0.9)"
                        : getNodeBorder(node.data?.type),
                    borderRadius: "12px",
                    padding: 12,
                    minWidth: 190,
                    boxShadow: isSelected
                        ? "0 0 0 1px rgba(103, 232, 249, 0.45), 0 0 24px rgba(34, 211, 238, 0.32)"
                        : isNew
                            ? "0 0 24px rgba(34, 211, 238, 0.45)"
                            : riskScore >= 80
                                ? "0 0 18px rgba(239, 68, 68, 0.16)"
                                : isExpanding
                                    ? "0 0 0 1px rgba(34, 211, 238, 0.35), 0 0 18px rgba(34, 211, 238, 0.28)"
                                    : "0 0 12px rgba(34, 211, 238, 0.12)",
                    outline: isNew ? "1px solid rgba(34, 211, 238, 0.35)" : "none",
                    transition: "all 0.25s ease",
                },
            };
        });
    }, [nodes, expandingNodeId, newlyAddedNodeIds, selectedNodeId]);

    const styledEdges = useMemo(() => {
        return edges.map((edge) => {
            const edgeStyles = getEdgeStyle(edge);

            return {
                ...edge,
                ...edgeStyles,
            };
        });
    }, [edges]);

    const runAutoFit = useCallback(() => {
        setTimeout(() => {
            fitView({
                padding: 0.2,
                duration: 800,
                maxZoom: 1.3,
            });
        }, 150);
    }, [fitView]);

    useEffect(() => {
        if (!expandSignal) return;
        runAutoFit();
    }, [expandSignal, runAutoFit]);

    useEffect(() => {
        if (!focusNodeId) return;

        const node = nodes.find((n) => n.id === focusNodeId);
        if (!node?.position) return;

        setTimeout(() => {
            setCenter(
                node.position.x,
                node.position.y,
                {
                    zoom: 1.2,
                    duration: 600,
                }
            );
        }, 300);
    }, [focusNodeId, nodes, setCenter]);

    const focusSelectedNode = useCallback(() => {
        if (!selectedNodeId) return;

        const selectedNode = nodes.find((node) => node.id === selectedNodeId);
        if (!selectedNode?.position) return;

        setCenter(
            selectedNode.position.x + 100,
            selectedNode.position.y + 40,
            {
                zoom: 1.15,
                duration: 500,
            }
        );
    }, [nodes, selectedNodeId, setCenter]);

    const captureGraphSnapshot = useCallback(async () => {
        if (!graphExportRef.current || !onGraphSnapshotReady) return;

        try {
            const dataUrl = await toPng(graphExportRef.current, {
                cacheBust: true,
                pixelRatio: 1,
                backgroundColor: "#0f172a",
                filter: (node) => {
                    if (!(node instanceof HTMLElement)) return true;

                    return (
                        !node.classList.contains("react-flow__controls") &&
                        !node.classList.contains("react-flow__panel")
                    );
                },
            });

            onGraphSnapshotReady(dataUrl);
        } catch (error) {
            console.error("Failed to capture graph snapshot:", error);
        }
    }, [onGraphSnapshotReady]);

    useEffect(() => {
        if (!isCaseMode) return;

        const timer = setTimeout(() => {
            captureGraphSnapshot();
        }, 900);

        return () => clearTimeout(timer);
    }, [
        isCaseMode,
        nodes,
        edges,
        selectedNodeId,
        newlyAddedNodeIds,
        showInsights,
        showLegend,
        captureGraphSnapshot,
    ]);

    useEffect(() => {
        if (!nodes?.length) return;

        const hasAttackSurfaceNodes = nodes.some(
            (node) => node.data?.source === "attack_surface"
        );

        if (!hasAttackSurfaceNodes) return;

        const timer = setTimeout(() => {
            fitView({
                padding: 0.24,
                duration: 700,
                maxZoom: 1.2,
            });
        }, 220);

        return () => clearTimeout(timer);
    }, [nodes, fitView]);

    return (
        <div
            ref={graphExportRef}
            className="panel h-[650px] overflow-hidden p-0"
        >
            <ReactFlow
                nodes={styledNodes}
                edges={styledEdges}
                fitView
                onNodeClick={(_, node) => onNodeClick(node)}
            >
                <Panel position="top-left">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={runAutoFit}
                            className="rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800"
                        >
                            Recenter
                        </button>

                        <button
                            onClick={focusSelectedNode}
                            disabled={!selectedNodeId}
                            className={`rounded-lg px-3 py-1.5 text-xs transition ${selectedNodeId
                                ? "border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25"
                                : "cursor-not-allowed border border-slate-700 bg-slate-900/60 text-slate-500"
                                }`}
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5" />
                                Focus selected
                            </span>
                        </button>

                        <button
                            onClick={() => setShowInsights((prev) => !prev)}
                            className="rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800"
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <PanelTop className="h-3.5 w-3.5" />
                                {showInsights ? "Hide Insights" : "Show Insights"}
                            </span>
                        </button>

                        <button
                            onClick={() => setShowLegend((prev) => !prev)}
                            className="rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800"
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <PanelBottom className="h-3.5 w-3.5" />
                                {showLegend ? "Hide Legend" : "Show Legend"}
                            </span>
                        </button>

                        <button
                            onClick={onDebugToast}
                            className="rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800"
                        >
                            <span className="inline-flex items-center gap-1.5">
                                <Maximize2 className="h-3.5 w-3.5" />
                                Test toast
                            </span>
                        </button>
                    </div>
                </Panel>

                {typeof discoveryCount === "number" && discoveryCount > 0 && (
                    <Panel position="top-center">
                        <div className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-4 py-2 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10">
                            +{discoveryCount} indicators discovered
                        </div>
                    </Panel>
                )}

                {showInsights && (
                    <Panel position="top-right">
                        <div className="w-64 rounded-2xl border border-slate-800 bg-slate-950/85 p-3 shadow-xl shadow-black/20 backdrop-blur">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-400">
                                Graph Insights
                            </p>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                        Nodes
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-white">
                                        {graphInsights?.totalNodes ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                        Links
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-white">
                                        {graphInsights?.totalEdges ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                        High Risk
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-red-300">
                                        {graphInsights?.highRiskCount ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                        Services
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-amber-300">
                                        {graphInsights?.exposedServices ?? 0}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                    <AlertTriangle className="h-3 w-3 text-cyan-400" />
                                    <span>Risk Summary</span>
                                </div>
                                <p className="mt-2 text-xs text-slate-300">
                                    {graphInsights?.highRiskCount ?? 0} high-risk entities and{" "}
                                    {graphInsights?.riskyEmails ?? 0} suspicious email-linked indicators currently visible.
                                </p>
                            </div>
                        </div>
                    </Panel>
                )}

                {showLegend && (
                    <Panel position="bottom-left">
                        <div className="w-56 rounded-2xl border border-slate-800 bg-slate-950/85 p-3 shadow-xl shadow-black/20 backdrop-blur">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-400">
                                Legend
                            </p>

                            <div className="mt-3 space-y-2 text-xs text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-3.5 w-3.5 text-cyan-300" />
                                    <span>Domain</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Waypoints className="h-3.5 w-3.5 text-amber-300" />
                                    <span>IP Address</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 text-emerald-300" />
                                    <span>Email</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Server className="h-3.5 w-3.5 text-red-300" />
                                    <span>Service</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-violet-300" />
                                    <span>Username</span>
                                </div>
                            </div>
                        </div>
                    </Panel>
                )}

                <Background color="#24324a" gap={24} />
                <Controls
                    className="!bg-slate-950/90 !border !border-slate-800 !rounded-xl !overflow-hidden"
                />
            </ReactFlow>
        </div>
    );
}

export default function GraphCanvas(props) {
    return (
        <ReactFlowProvider>
            <GraphCanvasInner {...props} />
        </ReactFlowProvider>
    );
}