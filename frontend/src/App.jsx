import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import Dashboard from "./pages/Dashboard";
import DomainPage from "./pages/DomainPage";
import Chatbot from "./pages/Chatbot";
import DatasetDetail from "./pages/DatasetDetail";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Default page */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="domain/:sector" element={<DomainPage />} />
          <Route path="domain/:sector/:filename" element={<DatasetDetail />} />
          <Route path="chatbot" element={<Chatbot />} />
        </Route>

      </Routes>

    </BrowserRouter>

  );
}