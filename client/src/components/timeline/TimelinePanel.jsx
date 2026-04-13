export default function TimelinePanel({ events }) {
    if (!events || events.length === 0) {
        return (
            <div className="panel p-5 text-sm text-muted">
                No timeline data available.
            </div>
        );
    }

    return (
        <div className="panel p-5">
            <h3 className="text-lg font-semibold text-text">
                Investigation Timeline
            </h3>

            <div className="mt-4 space-y-4">
                {events
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-3 border-l-2 border-accent/30 pl-4"
                        >
                            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />

                            <div>
                                <p className="text-sm font-medium text-text">
                                    {event.label}
                                </p>
                                <p className="text-xs text-muted">
                                    {new Date(event.date).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}