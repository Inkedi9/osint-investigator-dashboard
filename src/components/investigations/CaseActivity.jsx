export default function CaseActivity({ activity = [] }) {
    return (
        <div className="panel p-5">
            <h3 className="text-lg font-semibold text-text">Activity</h3>

            <div className="mt-4 space-y-3">
                {activity.map((a) => (
                    <div key={a.id} className="text-sm text-slate-300">
                        <p>
                            <span className="text-accent">{a.author}</span> — {a.action}
                        </p>
                        <p className="text-xs text-muted">{a.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}