import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import EntityPage from "./pages/EntityPage";
import GraphPage from "./pages/GraphPage";
import InvestigationsPage from "./pages/InvestigationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import CasePage from "./pages/CasePage";
import AttackSurfacePage from "./pages/AttackSurfacePage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/entity/:id" element={<EntityPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/attack-surface" element={<AttackSurfacePage />} />
            <Route path="/investigations" element={<InvestigationsPage />} />
            <Route path="/cases/:id" element={<CasePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    );
}