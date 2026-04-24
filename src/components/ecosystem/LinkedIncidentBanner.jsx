import { ArrowLeft, Radar } from "lucide-react";

export default function LinkedIncidentBanner({ incident }) {
    if (!incident?.incidentId) return null;

    return (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 shadow-lg shadow-cyan-500/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Radar className="h-4 w-4 text-cyan-300" />
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                            Linked OSINT Investigation
                        </p>
                    </div>

                    <p className="text-lg font-bold text-text">
                        {incident.incidentId}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-muted">
                        Imported from Purple Team Lab
                        {incident.ip ? ` · ip: ${incident.ip}` : ""}
                        {incident.domain ? ` · domain: ${incident.domain}` : ""}
                        {incident.ioc ? ` · ioc: ${incident.ioc}` : ""}
                    </p>
                </div>

                {incident.returnTo && (
                    <a
                        href={incident.returnTo}
                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500/20"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Return to Purple Team Lab
                    </a>
                )}
            </div>
        </div>
    );
}