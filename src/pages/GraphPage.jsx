import { useMemo, useState } from "react";
import GraphCanvas from "../components/graph/GraphCanvas";
import GraphNodeDetails from "../components/graph/GraphNodeDetails";
import GraphFilters from "../components/graph/GraphFilters";
import { mockGraph } from "../data/mockGraph";
import { addGraphEntityToFirstCase } from "../utils/graphCaseActions";
import { useToast } from "../components/ui/ToastProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
    getGraphInvestigationContext,
    saveGraphInvestigationContext,
} from "../utils/graphInvestigationContext";
import { mockEntities } from "../data/mockEntities";
import AIAnalystPanel from "../components/graph/AIAnalystPanel";
import { buildAiAnalystAssessment } from "../utils/aiAnalyst";
import { expandEntityGraph } from "../lib/mockApi";
import CorrelationPanel from "../components/correlation/CorrelationPanel";
import { buildCorrelationFindings } from "../utils/correlationEngine";
import AlertSimulationPanel from "../components/correlation/AlertSimulationPanel";
import { buildSimulatedAlerts } from "../utils/alertSimulation";
import ThreatScoreCard from "../components/correlation/ThreatScoreCard";
import { buildThreatScore } from "../utils/threatScoring";
import { addAlertToCase, addAlertTriageToCase } from "../utils/caseActions";


function getDefaultRiskScore(type) {
    if (type === "domain") return 82;
    if (type === "ip") return 68;
    if (type === "email") return 74;
    if (type === "service") return 91;
    if (type === "username") return 52;
    return 40;
}

function hydrateRisk(nodes) {
    return nodes.map((node) => ({
        ...node,
        data: {
            ...node.data,
            riskScore:
                typeof node.data?.riskScore === "number"
                    ? node.data.riskScore
                    : getDefaultRiskScore(node.data?.type),
        },
    }));
}

export default function GraphPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedNode, setSelectedNode] = useState(null);
    const [nodes, setNodes] = useState(hydrateRisk(mockGraph.nodes));
    const [edges, setEdges] = useState(mockGraph.edges);
    const [filters, setFilters] = useState(["domain", "ip", "email", "service", "username"]);
    const [expandSignal, setExpandSignal] = useState(0);
    const [isExpanding, setIsExpanding] = useState(false);
    const [expandingNodeId, setExpandingNodeId] = useState(null);
    const [pivotTrail, setPivotTrail] = useState([]);
    const [newlyAddedNodeIds, setNewlyAddedNodeIds] = useState([]);
    const [discoveredPivotIds, setDiscoveredPivotIds] = useState([]);
    const [discoveryCount, setDiscoveryCount] = useState(null);
    const [alertTriageMap, setAlertTriageMap] = useState(
        location.state?.alertTriage || {}
    );

    const focusNodeIdFromRoute = location.state?.focusNodeId || null;
    const caseIdFromRoute = location.state?.caseId || null;
    const caseTitleFromRoute = location.state?.caseTitle || null;
    const caseEntityIdsFromRoute = location.state?.caseEntityIds || [];
    const attackSurfaceGraphFromRoute = location.state?.attackSurfaceGraph || null;

    const [caseEntityIdsLocal, setCaseEntityIdsLocal] = useState(caseEntityIdsFromRoute);

    const { pushToast } = useToast();

    const handleExpandNode = async (nodeId) => {
        if (isExpanding) return;

        const currentNode = nodes.find((node) => node.id === nodeId);
        const nodeLabel = currentNode?.data?.label || nodeId;

        setIsExpanding(true);
        setExpandingNodeId(nodeId);

        try {
            const expansion = await expandEntityGraph(nodeId, {
                maxDepth: 2,
                existingNodeIds: nodes.map((node) => node.id),
                existingEdgeIds: edges.map((edge) => edge.id),
            });

            if (!expansion || ((!expansion.nodes || expansion.nodes.length === 0) && (!expansion.edges || expansion.edges.length === 0))) {
                pushToast({
                    type: "info",
                    title: "No enrichment available",
                    message: "No additional linked indicators were found for this entity.",
                });

                setIsExpanding(false);
                setExpandingNodeId(null);
                return;
            }

            let addedNodesCount = 0;
            let addedEdgesCount = 0;
            let newNodeIds = [];

            setNodes((prev) => {
                const existingIds = new Set(prev.map((n) => n.id));
                const newNodes = (expansion.nodes || []).filter((n) => !existingIds.has(n.id));

                newNodeIds = newNodes.map((n) => n.id);
                addedNodesCount = newNodes.length;

                return [...prev, ...newNodes];
            });

            setEdges((prev) => {
                const existingIds = new Set(prev.map((e) => e.id));
                const newEdges = (expansion.edges || []).filter((e) => !existingIds.has(e.id));
                addedEdgesCount = newEdges.length;

                return [...prev, ...newEdges];
            });

            setNewlyAddedNodeIds(newNodeIds);
            setDiscoveredPivotIds((prev) => [...new Set([...prev, ...newNodeIds])]);
            setExpandSignal((prev) => prev + 1);
            setDiscoveryCount(addedNodesCount);

            setPivotTrail((prev) => {
                const alreadyThere = prev.includes(nodeLabel);
                if (alreadyThere) return prev;
                return [...prev, nodeLabel];
            });

            if (addedNodesCount === 0 && addedEdgesCount === 0) {
                pushToast({
                    type: "info",
                    title: "Node already expanded",
                    message: `${nodeLabel} has already been enriched.`,
                });
            } else {
                pushToast({
                    type: "success",
                    title: "Enrichment completed",
                    message: `+${addedNodesCount} new indicator(s) discovered`,
                });
            }

            setTimeout(() => {
                setNewlyAddedNodeIds([]);
            }, 2000);

            setTimeout(() => {
                setDiscoveryCount(null);
            }, 2200);
        } catch (error) {
            console.error("Graph expansion failed:", error);

            pushToast({
                type: "error",
                title: "Expansion failed",
                message: "Unable to retrieve additional graph pivots.",
            });
        } finally {
            setIsExpanding(false);
            setExpandingNodeId(null);
        }
    };

    const handleToggleFilter = (type) => {
        setFilters((prev) =>
            prev.includes(type)
                ? prev.filter((item) => item !== type)
                : [...prev, type]
        );
    };

    const handleAddToCase = (entity) => {
        addGraphEntityToFirstCase(entity.id);
        setCaseEntityIdsLocal((prev) => [...new Set([...prev, entity.id])]);

        pushToast({
            type: "success",
            title: "Entity added",
            message: `${entity.data?.labelText || entity.data?.label || entity.id} added to investigation.`,
        });
    };

    const handleDebugToast = () => {
        pushToast({
            type: "success",
            title: "Toast test",
            message: "If you see this, the provider works.",
        });
    };

    const handlePushAlertToCase = (alert) => {
        if (!caseIdFromRoute) return;

        addAlertToCase(caseIdFromRoute, alert);

        pushToast({
            type: "success",
            title: "Alert added to case",
            message: `${alert.title} pushed to investigation activity.`,
        });
    };

    const handleTriageAlert = (alert, triageStatus) => {
        if (!caseIdFromRoute) return;

        const updatedTriage = {
            ...alertTriageMap,
            [alert.id]: {
                status: triageStatus,
                updatedAt: new Date().toISOString(),
                title: alert.title,
                severity: alert.severity,
            },
        };

        setAlertTriageMap(updatedTriage);

        saveGraphInvestigationContext(caseIdFromRoute, {
            alertTriage: updatedTriage,
        });

        addAlertTriageToCase(caseIdFromRoute, alert, triageStatus);

        pushToast({
            type: "success",
            title: "Alert triaged",
            message: `${alert.title} marked as ${triageStatus}.`,
        });
    };

    const filteredNodes = useMemo(() => {
        let result = nodes.filter((node) => filters.includes(node.data?.type));

        if (caseEntityIdsLocal.length > 0) {
            const scopedNodes = result.filter(
                (node) =>
                    caseEntityIdsLocal.includes(node.id) ||
                    discoveredPivotIds.includes(node.id)
            );

            if (scopedNodes.length > 0) {
                result = scopedNodes;
            }
        }

        return result;
    }, [nodes, filters, caseEntityIdsLocal, discoveredPivotIds]);

    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

    const filteredEdges = useMemo(() => {
        return edges.filter(
            (edge) =>
                filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
        );
    }, [edges, filteredNodeIds]);

    const graphInsights = useMemo(() => {
        const highRiskCount = filteredNodes.filter(
            (node) => (node.data?.riskScore || 0) >= 80
        ).length;

        const exposedServices = filteredNodes.filter(
            (node) => node.data?.type === "service"
        ).length;

        const riskyEmails = filteredNodes.filter(
            (node) => node.data?.type === "email" && (node.data?.riskScore || 0) >= 70
        ).length;

        return {
            totalNodes: filteredNodes.length,
            totalEdges: filteredEdges.length,
            highRiskCount,
            exposedServices,
            riskyEmails,
        };
    }, [filteredNodes, filteredEdges]);

    const aiAssessment = useMemo(() => {
        return buildAiAnalystAssessment({
            nodes: filteredNodes,
            pivotTrail,
            discoveredPivotIds,
            graphInsights,
            isCaseMode: !!caseIdFromRoute,
            caseTitle: caseTitleFromRoute,
        });
    }, [
        filteredNodes,
        pivotTrail,
        discoveredPivotIds,
        graphInsights,
        caseIdFromRoute,
        caseTitleFromRoute,
    ]);

    const correlationFindings = useMemo(() => {
        return buildCorrelationFindings({
            nodes: filteredNodes,
            edges: filteredEdges,
            graphInsights,
            pivotTrail,
            isCaseMode: !!caseIdFromRoute,
            caseTitle: caseTitleFromRoute,
        });
    }, [
        filteredNodes,
        filteredEdges,
        graphInsights,
        pivotTrail,
        caseIdFromRoute,
        caseTitleFromRoute,
    ]);

    const simulatedAlerts = useMemo(() => {
        return buildSimulatedAlerts({
            correlationFindings,
            nodes: filteredNodes,
            graphInsights,
        });
    }, [correlationFindings, filteredNodes, graphInsights]);

    const threatScore = useMemo(() => {
        return buildThreatScore({
            nodes: filteredNodes,
            edges: filteredEdges,
            graphInsights,
            correlationFindings,
            simulatedAlerts,
            pivotTrail,
            isCaseMode: !!caseIdFromRoute,
        });
    }, [
        filteredNodes,
        filteredEdges,
        graphInsights,
        correlationFindings,
        simulatedAlerts,
        pivotTrail,
        caseIdFromRoute,
    ]);

    useEffect(() => {
        if (!focusNodeIdFromRoute) return;

        const node = nodes.find((n) => n.id === focusNodeIdFromRoute);
        if (!node) return;

        setSelectedNode(node);
    }, [focusNodeIdFromRoute, nodes]);

    useEffect(() => {
        if (!caseIdFromRoute) return;

        const discoveredPivotEntities = discoveredPivotIds
            .map((id) => {
                const graphNode = nodes.find((node) => node.id === id);
                const entityMatch = mockEntities.find((entity) => entity.id === id);

                if (entityMatch) {
                    return {
                        id: entityMatch.id,
                        type: entityMatch.type,
                        value: entityMatch.value,
                        riskScore: entityMatch.riskScore,
                    };
                }

                if (graphNode) {
                    return {
                        id: graphNode.id,
                        type: graphNode.data?.type || "unknown",
                        value: graphNode.data?.labelText || graphNode.data?.label || graphNode.id,
                        riskScore: graphNode.data?.riskScore || 0,
                    };
                }

                return null;
            })
            .filter(Boolean);

        saveGraphInvestigationContext(caseIdFromRoute, {
            pivotTrail,
            discoveredPivotIds,
            discoveredPivots: discoveredPivotEntities,
            threatScore,
            correlationFindings,
            simulatedAlerts,
            alertTriage: alertTriageMap,
        });
    }, [
        caseIdFromRoute,
        pivotTrail,
        discoveredPivotIds,
        nodes,
        threatScore,
        correlationFindings,
        simulatedAlerts,
        alertTriageMap,
    ]);

    useEffect(() => {
        if (!attackSurfaceGraphFromRoute) return;

        try {
            // Hydratation des nodes (IMPORTANT pour ton système de riskScore)
            const hydratedNodes = hydrateRisk(attackSurfaceGraphFromRoute.nodes || []);
            const newEdges = attackSurfaceGraphFromRoute.edges || [];

            setNodes(hydratedNodes);
            setEdges(newEdges);

            // Reset du contexte d'exploration (sinon bug visuel possible)
            setPivotTrail([]);
            setDiscoveredPivotIds([]);
            setNewlyAddedNodeIds([]);
            setDiscoveryCount(null);

            // Focus auto sur le domaine
            const focusId = attackSurfaceGraphFromRoute.focusNodeId;

            if (focusId) {
                const node = hydratedNodes.find((n) => n.id === focusId);
                if (node) {
                    setSelectedNode(node);
                }
            }

        } catch (err) {
            console.error("Failed to load attack surface graph:", err);
        }
    }, [attackSurfaceGraphFromRoute]);

    useEffect(() => {
        if (!caseIdFromRoute) return;

        const existingContext = getGraphInvestigationContext(caseIdFromRoute);
        if (existingContext?.alertTriage) {
            setAlertTriageMap(existingContext.alertTriage);
        }
    }, [caseIdFromRoute]);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">
                    Graph View
                </p>
                <h2 className="mt-2 text-3xl font-bold text-text">
                    Advanced Entity Relationship Graph
                </h2>
                <p className="mt-2 text-sm text-muted">
                    Expand relationships, pivot entities, and enrich investigations directly from the graph.
                </p>
            </div>

            <GraphFilters filters={filters} onToggle={handleToggleFilter} />
            {attackSurfaceGraphFromRoute && (
                <p className="mt-2 text-xs text-cyan-400">
                    Loaded from Attack Surface scan
                </p>
            )}
            {caseIdFromRoute && (
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                        Investigation Mode
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="rounded-lg border border-cyan-500/20 bg-slate-950/60 px-3 py-1 text-cyan-300">
                                {caseTitleFromRoute || caseIdFromRoute}
                            </span>
                            <span className="text-slate-400">
                                {caseEntityIdsLocal.length} linked entities in scope
                            </span>
                        </div>

                        <button
                            onClick={() => navigate("/graph")}
                            className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800"
                        >
                            Exit Investigation Mode
                        </button>
                    </div>
                </div>
            )}
            <ThreatScoreCard threatScore={threatScore} />
            <AIAnalystPanel assessment={aiAssessment} />
            <CorrelationPanel findings={correlationFindings} />
            <AlertSimulationPanel
                alerts={simulatedAlerts}
                onPushToCase={caseIdFromRoute ? handlePushAlertToCase : null}
                onTriageAlert={caseIdFromRoute ? handleTriageAlert : null}
                triageMap={alertTriageMap}
            />
            {pivotTrail.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                        Investigation Trail
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-200">
                        {pivotTrail.map((item, index) => (
                            <div key={`${item}-${index}`} className="flex items-center gap-2">
                                <span className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1">
                                    {item}
                                </span>
                                {index < pivotTrail.length - 1 && (
                                    <span className="text-slate-500">→</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <GraphCanvas
                    nodes={filteredNodes}
                    edges={filteredEdges}
                    onNodeClick={(node) => {
                        const originalNode = nodes.find((item) => item.id === node.id) || node;
                        setSelectedNode(originalNode);
                    }}
                    expandSignal={expandSignal}
                    onDebugToast={handleDebugToast}
                    expandingNodeId={expandingNodeId}
                    newlyAddedNodeIds={newlyAddedNodeIds}
                    discoveryCount={discoveryCount}
                    graphInsights={graphInsights}

                    // ✅ AJOUT ICI
                    focusNodeId={focusNodeIdFromRoute}
                    selectedNodeId={selectedNode?.id || null}
                    isCaseMode={!!caseIdFromRoute}
                    caseEntityIds={caseEntityIdsLocal}
                    onGraphSnapshotReady={(dataUrl) => {
                        if (!caseIdFromRoute) return;

                        saveGraphInvestigationContext(caseIdFromRoute, {
                            graphImage: dataUrl,
                        });
                    }}
                />

                <GraphNodeDetails
                    selectedNode={selectedNode}
                    onExpand={handleExpandNode}
                    onAddToCase={handleAddToCase}
                    isExpanding={isExpanding}
                    expandingNodeId={expandingNodeId}
                />
            </div>
        </div>
    );
}