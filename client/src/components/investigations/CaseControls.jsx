import Card from "../common/Card";

export default function CaseControls({
    status,
    priority,
    onStatusChange,
    onPriorityChange,
}) {
    return (
        <Card>
            <h3 className="text-lg font-semibold text-text">Case Controls</h3>

            <div className="mt-4 space-y-4">
                <div>
                    <label className="mb-2 block text-sm text-muted">Status</label>
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-accent/40"
                    >
                        <option value="Open">Open</option>
                        <option value="In Review">In Review</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-muted">Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none transition focus:border-accent/40"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>
        </Card>
    );
}