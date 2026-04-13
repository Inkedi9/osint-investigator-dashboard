import { useEffect, useState } from "react";
import CaseList from "../components/investigations/CaseList";
import NewCaseModal from "../components/investigations/NewCaseModal";
import { mockCases } from "../data/mockCases";
import { loadCases, saveCases, clearCasesStorage } from "../utils/caseStorage";

export default function InvestigationsPage() {
    const [cases, setCases] = useState(() => loadCases(mockCases));
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            <CaseList cases={cases} />

            <NewCaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateCase}
            />
        </div>
    );
}