import { useState } from "react";

export default function NewCaseModal({ isOpen, onClose, onCreate }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) return;

        const newCase = {
            id: `case_${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            status: "Open",
            priority,
            createdAt: new Date().toISOString().slice(0, 10),
            entityIds: [],
            notes: [],
        };

        onCreate(newCase);

        setTitle("");
        setDescription("");
        setPriority("Medium");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="panel w-full max-w-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-accent">
                            New Investigation
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-text">
                            Create a New Case
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-border px-3 py-2 text-sm text-muted transition hover:text-text"
                    >
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-muted">Case Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Example: Suspicious Infrastructure Investigation"
                            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-muted">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the investigation context..."
                            rows={5}
                            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-muted"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-muted">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-border px-4 py-3 text-sm text-muted transition hover:text-text"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-medium text-accent transition hover:bg-accent/20"
                        >
                            Create Case
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}