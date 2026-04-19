import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addNoteToCase } from "../utils/caseActions";
import { exportCaseReport } from "../utils/reportExport";
import CaseNotes from "../components/investigations/CaseNotes";
import CaseControls from "../components/investigations/CaseControls";
import { updateCaseFields } from "../utils/updateCaseFields";
import { downloadCasePdfReport } from "../services/api";
import { triggerPdfDownload } from "../utils/downloadPdf";
import CaseComments from "../components/investigations/CaseComments";
import CaseActivity from "../components/investigations/CaseActivity";
import { getGraphInvestigationContext } from "../utils/graphInvestigationContext";
import { getCaseById, getEntitiesByCase } from "../lib/mockApi";
import CaseSummaryPanel from "../components/investigations/CaseSummaryPanel";

export default function CasePage() {
    const handleStatusChange = async (newStatus) => {
        updateCaseFields(currentCase.id, {
            status: newStatus,
        });

        const updatedCase = await getCaseById(currentCase.id);
        if (updatedCase) {
            setCurrentCase(updatedCase);
        }
    };

    const handlePriorityChange = async (newPriority) => {
        updateCaseFields(currentCase.id, {
            priority: newPriority,
        });

        const updatedCase = await getCaseById(currentCase.id);
        if (updatedCase) {
            setCurrentCase(updatedCase);
        }
    };
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentCase, setCurrentCase] = useState(null);
    const [linkedEntities, setLinkedEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadCasePage() {
            setIsLoading(true);
            setError(null);

            try {
                const caseData = await getCaseById(id);

                if (!caseData) {
                    if (!isCancelled) {
                        setCurrentCase(null);
                        setLinkedEntities([]);
                        setError("Case not found");
                    }
                    return;
                }

                const entities = await getEntitiesByCase(id);

                if (!isCancelled) {
                    setCurrentCase(caseData);
                    setLinkedEntities(entities);
                }
            } catch (err) {
                console.error("Failed to load case page:", err);

                if (!isCancelled) {
                    setCurrentCase(null);
                    setLinkedEntities([]);
                    setError("Failed to load case details.");
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadCasePage();

        return () => {
            isCancelled = true;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="panel p-6">
                <h2 className="text-2xl font-bold text-text">Loading case...</h2>
                <p className="mt-2 text-sm text-muted">
                    Retrieving investigation details, linked entities, and analyst context.
                </p>
            </div>
        );
    }

    if (error || !currentCase) {
        return (
            <div className="panel p-6">
                <h2 className="text-2xl font-bold text-text">Case not found</h2>
                <p className="mt-2 text-sm text-muted">
                    {error || `No investigation case matches this ID: ${id}`}
                </p>
            </div>
        );
    }

    const graphContext = getGraphInvestigationContext(currentCase.id);

    const handleAddNote = async (noteContent) => {
        addNoteToCase(currentCase.id, noteContent);

        const updatedCase = await getCaseById(currentCase.id);
        if (updatedCase) {
            setCurrentCase(updatedCase);
        }
    };

    const handleGenerateServerPdf = async () => {
        try {
            const reportContext = {
                currentCase,
                linkedEntities,
                pivotTrail: graphContext?.pivotTrail || [],
                discoveredPivotIds: graphContext?.discoveredPivotIds || [],
                discoveredPivots: graphContext?.discoveredPivots || [],
                graphImage: graphContext?.graphImage || null,
                threatScore: graphContext?.threatScore || null,
                correlationFindings: graphContext?.correlationFindings || [],
                simulatedAlerts: graphContext?.simulatedAlerts || [],
                analystSummary:
                    graphContext?.analystSummary ||
                    `This report summarizes the current state of investigation ${currentCase.id}, including linked entities, analyst notes, graph-based pivots, correlation findings, simulated alerts, and contextual enrichment performed during the investigation workflow.`,
            };

            const blob = await downloadCasePdfReport(currentCase.id, reportContext);
            triggerPdfDownload(blob, `${currentCase.id}-report.pdf`);
        } catch (error) {
            console.error("Server PDF download failed:", error);
        }
    };

    const handleAddComment = async (comment) => {
        updateCaseFields(currentCase.id, {
            comments: [...(currentCase.comments || []), comment],
            activity: [
                ...(currentCase.activity || []),
                {
                    id: Date.now().toString(),
                    action: "Comment added",
                    author: "You",
                    date: new Date().toLocaleString(),
                },
            ],
        });

        const updatedCase = await getCaseById(currentCase.id);
        if (updatedCase) {
            setCurrentCase(updatedCase);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-accent">
                    {currentCase.status}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-text">
                    {currentCase.title}
                </h1>
                <p className="mt-2 text-sm text-muted">{currentCase.description}</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <CaseSummaryPanel graphContext={graphContext} />

                    <CaseNotes
                        notes={currentCase.notes || []}
                        onAddNote={handleAddNote}
                    />

                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">Linked Entities</h3>

                        <div className="mt-4 grid gap-3">
                            {linkedEntities.length > 0 ? (
                                linkedEntities.map((entity) => (
                                    <div
                                        key={entity.id}
                                        onClick={() => navigate(`/entity/${entity.id}`)}
                                        className="cursor-pointer rounded-xl border border-border bg-surfaceLight p-4 transition hover:bg-surface"
                                    >
                                        <p className="text-xs uppercase tracking-[0.2em] text-muted">
                                            {entity.type}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-text">
                                            {entity.value}
                                        </p>
                                        <p className="mt-1 text-xs text-muted">
                                            Risk Score: {entity.riskScore}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted">
                                    No linked entities for this case yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <CaseControls
                        status={currentCase.status}
                        priority={currentCase.priority}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                    />
                    <CaseComments
                        comments={currentCase.comments || []}
                        onAdd={handleAddComment}
                    />

                    <CaseActivity activity={currentCase.activity || []} />
                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">Case Overview</h3>

                        <div className="mt-4 space-y-3 text-sm text-slate-300">
                            <p>
                                <span className="text-muted">Priority:</span>{" "}
                                {currentCase.priority}
                            </p>
                            <p>
                                <span className="text-muted">Created:</span>{" "}
                                {currentCase.createdAt}
                            </p>
                            <p>
                                <span className="text-muted">Entities:</span>{" "}
                                {currentCase.entityIds.length}
                            </p>
                            <p>
                                <span className="text-muted">Notes:</span>{" "}
                                {(currentCase.notes || []).length}
                            </p>
                            <p>
                                <span className="text-muted">Assignee:</span>{" "}
                                {currentCase.assignee || "Unassigned"}
                            </p>

                            <p>
                                <span className="text-muted">Reviewer:</span>{" "}
                                {currentCase.reviewer || "None"}
                            </p>
                        </div>
                    </div>

                    <div className="panel p-5">
                        <h3 className="text-lg font-semibold text-text">Analyst Action</h3>

                        <div className="mt-4 space-y-3">
                            <button
                                onClick={() => exportCaseReport(currentCase, linkedEntities)}
                                className="w-full rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent transition hover:bg-accent/20"
                            >
                                Export Report
                            </button>

                            <button
                                onClick={handleGenerateServerPdf}
                                className="w-full rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success transition hover:bg-success/20"
                            >
                                Generate Server PDF
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/graph", {
                                        state: {
                                            caseId: currentCase.id,
                                            caseTitle: currentCase.title,
                                            caseEntityIds: currentCase.entityIds || [],
                                            attackSurfaceGraph: graphContext?.attackSurfaceGraph || null,
                                            focusNodeId:
                                                graphContext?.attackSurfaceGraph?.focusNodeId || null,
                                        },
                                    })
                                }
                                className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/25"
                            >
                                Open Graph View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}