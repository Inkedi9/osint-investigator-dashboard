import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
    return (
        <div className="app-shell flex min-h-screen text-text">
            <Sidebar />

            <div className="flex min-h-screen flex-1 flex-col">
                <Topbar />

                <main className="grid-pattern flex-1 p-6">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}