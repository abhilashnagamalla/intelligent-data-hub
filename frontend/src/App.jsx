import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import DomainPage from "./pages/DomainPage";

function ProtectedRoute({ children }) {

  const user = localStorage.getItem("user");

  return user ? children : <Navigate to="/" />;

}

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/domain/:name"
          element={
            <ProtectedRoute>
              <DomainPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}