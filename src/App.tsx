import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ManageSessions from "./components/sessions/ManageSessions";
import ProfileForm from "./components/profile/ProfileForm";
import StudentsList from "./components/students/StudentsList";
import ReportsPage from "./components/reports/ReportsPage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import AuthLayout from "./components/auth/AuthLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";

function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "student" | "lecturer";
}) {
  const { user, loading } = useAuth();
  const userRole = localStorage.getItem("userRole");

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(2,30,70,0.4)_0%,rgba(2,8,23,0.95)_100%)]" />
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        </div>
        <p className="relative z-20 text-lg text-white/60">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" />;

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(2,30,70,0.4)_0%,rgba(2,8,23,0.95)_100%)]" />
              <div className="absolute inset-0 z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
              </div>
              <p className="relative z-20 text-lg text-white/60">Loading...</p>
            </div>
          }
        >
          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO && useRoutes(routes)}

          <Routes>
            {/* App routes */}
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="/auth/register" element={<AuthLayout />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <ManageSessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute requiredRole="lecturer">
                  <StudentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole="lecturer">
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute requiredRole="lecturer">
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            {/* Add catch-all route */}
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;