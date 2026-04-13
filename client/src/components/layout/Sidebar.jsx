import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Search,
    Network,
    FolderOpen,
    FileText,
    Settings,
    Shield,
} from "lucide-react";

const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/search", label: "Search", icon: Search },
    { to: "/graph", label: "Graph View", icon: Network },
    { to: "/investigations", label: "Investigations", icon: FolderOpen },
    { to: "/reports", label: "Reports", icon: FileText },
    { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    return (
        <aside className="flex w-72 flex-col border-r border-border bg-surface/90 p-5">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-glow">
                    <Shield size={20} />
                </div>

                <div>
                    <h1 className="text-sm font-semibold tracking-wide text-text">
                        OSINT Investigator
                    </h1>
                    <p className="text-xs text-muted">Cyber Intelligence Workspace</p>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${isActive
                                ? "border-accent/40 bg-accent/10 text-accent shadow-glow"
                                : "border-transparent text-slate-300 hover:border-border hover:bg-surfaceLight"
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="panel mt-6 p-4">
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-accent">
                    Demo Mode
                </p>
                <p className="text-sm text-slate-300">
                    Mock OSINT data loaded for investigation scenarios.
                </p>
            </div>
        </aside>
    );
}