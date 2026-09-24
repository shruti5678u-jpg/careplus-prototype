import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppStateProvider } from "./state";
import { ToastProvider } from "./components/Toast";
import Simulator from "./pages/Simulator";
import PlanCompare from "./pages/PlanCompare";
import Declaration from "./pages/Declaration";
import Dashboard from "./pages/Dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Simulator />} />
      <Route path="/plans" element={<PlanCompare />} />
      <Route path="/declaration" element={<Declaration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ToastProvider>
    </AppStateProvider>
  );
}
