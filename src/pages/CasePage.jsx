import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockCases } from "../data/mockCases";
import { mockEntities } from "../data/mockEntities";
import { loadCases } from "../utils/caseStorage";
import { addNoteToCase } from "../utils/caseActions";
import { exportCaseReport } from "../utils/reportExport";
import CaseNotes from "../components/investigations/CaseNotes";
import CaseControls from "../components/investigations/CaseControls";
import { updateCaseFields } from "../utils/updateCaseFields";

export default function CasePage() {
    const handleStatusChange = (newStatus) => {
        const updatedCases = updateCaseFields(currentCase.id, {
            status: newStatus,
        });
        setAllCases(updatedCases);
    };

    const handlePriorityChange = (newPriority) => {
        const updatedCases = updateCaseFields(currentCase.id, {
            priority: newPriority,
        });
        setAllCases(updatedCases);
    };
    const { id } = useParams();
    const navigate = useNavigate();

    const [allCases, setAllCases] = useState(() => loadCases(mockCases));

    useEffect(() => {
        setAllCases(loadCases(mockCases));
    }, []);

    const currentCase = useMemo(
        () => allCases.find((c) => c.id === id),
        [allCases, id]
    );

    if (!currentCase) {
        return (
            <div className="panel p-6">
                <h2 className="text-2xl font-bold text-text">Case not found</h2>
                <p className="mt-2 text-sm text-muted">
                    No investigation case matches this ID: {id}
                </p>
            </div>
        );
    }

    const linkedEntities = mockEntities.filter((entity) =>
        currentCase.entityIds.includes(entity.id)
    );

    const handleAddNote = (noteContent) => {
        const { updatedCases } = addNoteToCase(currentCase.id, noteContent);
        setAllCases(updatedCases);
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
                                onClick={() => navigate("/graph")}
                                className="w-full rounded-xl border border-border bg-surfaceLight px-4 py-3 text-sm font-medium text-text transition hover:bg-surface"
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