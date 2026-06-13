import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ExamSetup from "./pages/ExamSetup";
import StudyPlan from "./pages/StudyPlan";
import AIMentor from "./pages/AIMentor";
import ProgressTracker from "./pages/ProgressTracker";
import Quiz from "./pages/Quiz";

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[var(--c-bg)] bg-grid-ink bg-grid-sm">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam-setup"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ExamSetup />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/study-plan"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <StudyPlan />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-mentor"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AIMentor />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProgressTracker />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Quiz />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}