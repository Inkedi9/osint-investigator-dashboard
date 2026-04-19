import { useCallback, useEffect, useRef, useState } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    Controls,
    MiniMap,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import GraphContextMenu from "./GraphContextMenu";
import PivotHistoryPanel from "./PivotHistoryPanel";
import { useToast } from "../ui/ToastProvider";
import { createPivotEntry } from "../../utils/graphPivot";

function buildExpandedData(node) {
    const baseX = node.position.x;
    const baseY = node.position.y;

    const newNodes = [
        {
            id: `${node.id}-service-443`,
            type: "default",
            position: { x: baseX + 220, y: baseY - 80 },
            data: { label: "443 / HTTPS", entityType: "service" },
        },
        {
            id: `${node.id}-email-admin`,
            type: "default",
            position: { x: baseX + 220, y: baseY + 40 },
            data: { label: "admin@target.tld", entityType: "email" },
        },
    ];

    const newEdges = [
        {
            id: `e-${node.id}-${node.id}-service-443`,
            source: node.id,
            target: `${node.id}-service-443`,
        },
        {
            id: `e-${node.id}-${node.id}-email-admin`,
            source: node.id,
            target: `${node.id}-email-admin`,
        },
    ];

    return { newNodes, newEdges };
}

function GraphAdvancedInner({
    initialNodes = [],
    initialEdges = [],
    onAddEntityToCase,
    onOpenEntity,
}) {

    const [shouldAutoFit, setShouldAutoFit] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [pivotHistory, setPivotHistory] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);

    const wrapperRef = useRef(null);
    const { fitView } = useReactFlow();
    const { pushToast } = useToast();

    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    useEffect(() => {
        const handleGlobalClick = () => closeContextMenu();
        window.addEventListener("click", handleGlobalClick);
        return () => window.removeEventListener("click", handleGlobalClick);
    }, [closeContextMenu]);

    useEffect(() => {
        if (!shouldAutoFit) return;

        const timer = setTimeout(() => {
            fitView({
                padding: 0.2,
                duration: 800,
                maxZoom: 1.3,
            });
            setShouldAutoFit(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [shouldAutoFit, nodes, edges, fitView]);

    const runAutoFit = useCallback(() => {
        setTimeout(() => {
            fitView({
                padding: 0.2,
                duration: 800,
                maxZoom: 1.3,
            });
        }, 150);
    }, [fitView]);

    const handleExpandNode = useCallback((node) => {
        const { newNodes, newEdges } = buildExpandedData(node);

        setNodes((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const uniqueNodes = newNodes.filter((n) => !existingIds.has(n.id));
            return [...prev, ...uniqueNodes];
        });

        setEdges((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const uniqueEdges = newEdges.filter((e) => !existingIds.has(e.id));
            return [...prev, ...uniqueEdges];
        });

        setPivotHistory((prev) => [
            createPivotEntry({
                action: "Expanded",
                entity: { label: node.data.label, id: node.id },
            }),
            ...prev,
        ]);

        pushToast({
            type: "success",
            title: "Node expanded",
            message: `${node.data.label} has been enriched with related indicators.`,
        });

        runAutoFit();
    }, [pushToast, runAutoFit, setEdges, setNodes]);

    const handleAddToCase = useCallback((node) => {
        if (onAddEntityToCase) {
            onAddEntityToCase(node);
        }

        setPivotHistory((prev) => [
            createPivotEntry({
                action: "Added to case",
                entity: { label: node.data.label, id: node.id },
            }),
            ...prev,
        ]);

        pushToast({
            type: "success",
            title: "Entity added",
            message: `${node.data.label} added to investigation.`,
        });
    }, [onAddEntityToCase, pushToast]);

    const handleNodeClick = useCallback((_, node) => {
        setSelectedNode(node);
    }, []);

    const handleNodeContextMenu = useCallback((event, node) => {
        event.preventDefault();

        const pane = wrapperRef.current?.getBoundingClientRect();
        if (!pane) return;

        setContextMenu({
            node,
            x: Math.min(event.clientX, window.innerWidth - 240),
            y: Math.min(event.clientY, window.innerHeight - 180),
        });
    }, []);

    return (
        <div className="grid grid-cols-12 gap-4">
            <div
                ref={wrapperRef}
                className="col-span-9 h-[720px] rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden relative"
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={handleNodeClick}
                    onNodeContextMenu={handleNodeContextMenu}
                    fitView
                    fitViewOptions={{ padding: 0.18 }}
                >
                    <Panel position="top-left">
                        <div className="flex gap-2">
                            <button
                                onClick={runAutoFit}
                                className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800 transition"
                            >
                                Recenter
                            </button>

                            <button
                                onClick={() =>
                                    pushToast({
                                        type: "success",
                                        title: "Toast test",
                                        message: "If you see this, the provider works.",
                                    })
                                }
                                className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900/90 text-white hover:bg-slate-800 transition"
                            >
                                Test toast
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
                    <Background />
                    <MiniMap />
                    <Controls />
                </ReactFlow>

                {contextMenu && (
                    <GraphContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        node={contextMenu.node}
                        onClose={closeContextMenu}
                        onExpand={handleExpandNode}
                        onAddToCase={handleAddToCase}
                        onOpenEntity={(node) => onOpenEntity?.(node)}
                    />
                )}
            </div>

            <div className="col-span-3 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
                    <h3 className="text-sm font-semibold text-white mb-3">TEST GRAPHADVANCED</h3>

                    {selectedNode ? (
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-slate-400">Label:</span>{" "}
                                <span className="text-white">{selectedNode.data.label}</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Type:</span>{" "}
                                <span className="text-cyan-400">
                                    {selectedNode.data.entityType || "unknown"}
                                </span>
                            </div>

                            <div className="pt-3 flex flex-col gap-2">
                                <button
                                    onClick={() => handleExpandNode(selectedNode)}
                                    className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-2 text-cyan-300 hover:bg-cyan-500/30 transition"
                                >
                                    Expand
                                </button>

                                <button
                                    onClick={() => handleAddToCase(selectedNode)}
                                    className="rounded-lg bg-purple-500/20 border border-purple-500/30 px-3 py-2 text-purple-300 hover:bg-purple-500/30 transition"
                                >
                                    Add to case
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            Select a node to inspect its metadata and pivot options.
                        </p>
                    )}
                </div>

                <PivotHistoryPanel history={pivotHistory} />
            </div>
        </div>
    );
}

export default function GraphAdvanced(props) {
    return (
        <ReactFlowProvider>
            <GraphAdvancedInner {...props} />
        </ReactFlowProvider>
    );
}