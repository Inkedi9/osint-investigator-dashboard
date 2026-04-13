import { useState } from "react";
import { loadCases, saveCases } from "../../utils/caseStorage";
import { mockCases } from "../../data/mockCases";

export default function AddToCaseModal({ isOpen, onClose, entityId, onSuccess }) {
    const [cases, setCases] = useState(() => loadCases(mockCases));
    const [selectedCaseId, setSelectedCaseId] = useState("");

    if (!isOpen) return null;

    const handleAdd = () => {
        if (!selectedCaseId) return;

        let entityAdded = false;

        const updatedCases = cases.map((c) => {
            if (c.id === selectedCaseId) {
                if (!c.entityIds.includes(entityId)) {
                    entityAdded = true;
                    return {
                        ...c,
                        entityIds: [...c.entityIds, entityId],
                    };
                }
            }
            return c;
        });

        saveCases(updatedCases);
        setCases(updatedCases);
        onClose();

        if (entityAdded && onSuccess) {
            onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="panel w-full max-w-xl p-6">
                <h2 className="text-xl font-semibold text-text">
                    Add Entity to Case
                </h2>

                <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="mt-4 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none"
                >
                    <option value="">Select a case</option>
                    {cases.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.title}
                        </option>
                    ))}
                </select>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-border px-4 py-2 text-sm text-muted transition hover:text-text"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleAdd}
                        className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                        Add to Case
                    </button>
                </div>
            </div>
        </div>
    );
}