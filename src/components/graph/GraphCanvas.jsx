import { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export default function GraphCanvas({ nodes, edges, onNodeClick }) {
    const styledNodes = useMemo(() => {
        return nodes.map((node) => ({
            ...node,
            style: {
                background: "#121a2a",
                color: "#e6eef8",
                border: "1px solid #24324a",
                borderRadius: "12px",
                padding: 10,
                minWidth: 180,
                boxShadow: "0 0 12px rgba(34, 211, 238, 0.12)",
            },
        }));
    }, [nodes]);

    const styledEdges = useMemo(() => {
        return edges.map((edge) => ({
            ...edge,
            style: { stroke: "#22d3ee", strokeWidth: 1.5 },
            labelStyle: { fill: "#94a3b8", fontSize: 12 },
        }));
    }, [edges]);

    return (
        <div className="panel h-[650px] overflow-hidden p-0">
            <ReactFlow
                nodes={styledNodes}
                edges={styledEdges}
                fitView
                onNodeClick={(_, node) => onNodeClick(node)}
            >
                <Background color="#24324a" gap={24} />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}