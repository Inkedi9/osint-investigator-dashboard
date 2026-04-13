import { useState } from "react";
import GraphCanvas from "../components/graph/GraphCanvas";
import GraphNodeDetails from "../components/graph/GraphNodeDetails";
import { mockGraph } from "../data/mockGraph";

export default function GraphPage() {
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">
                    Graph View
                </p>
                <h2 className="mt-2 text-3xl font-bold text-text">
                    Entity Relationship Graph
                </h2>
                <p className="mt-2 text-sm text-muted">
                    Visual link analysis between domains, IPs, emails, and related artifacts.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <GraphCanvas
                    nodes={mockGraph.nodes}
                    edges={mockGraph.edges}
                    onNodeClick={setSelectedNode}
                />

                <GraphNodeDetails selectedNode={selectedNode} />
            </div>
        </div>
    );
}