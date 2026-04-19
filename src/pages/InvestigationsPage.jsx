import { useEffect, useMemo, useState } from "react";
import CaseList from "../components/investigations/CaseList";
import NewCaseModal from "../components/investigations/NewCaseModal";
import { mockCases } from "../data/mockCases";
import { loadCases, saveCases, clearCasesStorage } from "../utils/caseStorage";

export default function InvestigationsPage() {
    const [cases, setCases] = useState(() => loadCases(mockCases));
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        query: "",
    });

    const handleCreateCase = (newCase) => {
        setCases((prev) => [newCase, ...prev]);
    };

    const handleResetCases = () => {
        clearCasesStorage();
        setCases(mockCases);
    };

    useEffect(() => {
        saveCases(cases);
    }, [cases]);

    const filteredCases = useMemo(() => {
        let result = [...cases];

        if (filters.status) {
            result = result.filter(
                (item) => String(item.status || "").toLowerCase() === filters.status
            );
        }

        if (filters.priority) {
            result = result.filter(
                (item) => String(item.priority || "").toLowerCase() === filters.priority
            );
        }

        if (filters.query.trim()) {
            const q = filters.query.trim().toLowerCase();

            result = result.filter((item) => {
                const haystack = [
                    item.id,
                    item.title,
                    item.description,
                    item.status,
                    item.priority,
                    item.assignee,
                    item.reviewer,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return haystack.includes(q);
            });
        }

        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [cases, filters]);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-accent">
                        Investigations
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-text">
                        Investigation Case Management
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Review active cases, priorities, and linked entities.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent transition hover:bg-accent/20"
                    >
                        + New Case
                    </button>

                    <button
                        onClick={handleResetCases}
                        className="rounded-xl border border-border px-4 py-3 text-sm text-muted transition hover:text-text"
                    >
                        Reset Cases
                    </button>
                </div>
            </div>

            <div className="panel p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col gap-3 md:flex-row">
                        <input
                            type="text"
                            value={filters.query}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    query: e.target.value,
                                }))
                            }
                            placeholder="Search case title, description, assignee..."
                            className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
                        />

                        <select
                            value={filters.status}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                }))
                            }
                            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none"
                        >
                            <option value="">All status</option>
                            <option value="open">Open</option>
                            <option value="investigating">Investigating</option>
                            <option value="in review">In Review</option>
                            <option value="closed">Closed</option>
                        </select>

                        <select
                            value={filters.priority}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    priority: e.target.value,
                                }))
                            }
                            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none"
                        >
                            <option value="">All priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="text-sm text-muted">
                        {filteredCases.length} case{filteredCases.length > 1 ? "s" : ""} visible
                    </div>
                </div>
            </div>

            {filteredCases.length === 0 ? (
                <div className="panel p-8 text-center">
                    <p className="text-sm font-medium text-text">
                        No investigations matched the current filters.
                    </p>
                    <p className="mt-2 text-sm text-muted">
                        Adjust the filters or create a new investigation case.
                    </p>
                </div>
            ) : (
                <CaseList cases={filteredCases} />
            )}

            <NewCaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCase}
            />
        </div>
    );
}