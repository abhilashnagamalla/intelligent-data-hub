import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Dashboard from "./pages/Dashboard";
import DomainPage from "./pages/DomainPage";
import Chatbot from "./pages/Chatbot";
import DatasetDetail from "./pages/DatasetDetailLive";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Public routes mapped alongside Main Layout structures */}
      <Route element={<Layout />}>
        <Route path="/domain/:sector" element={<DomainPage />} />
        <Route path="/domain/:sector/:filename" element={<DatasetDetail />} />
      </Route>

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="chatbot" element={<Chatbot />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
