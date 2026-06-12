import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';

// Page imports
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardV2Page from './pages/DashboardV2Page';
import AthletesPage from './pages/AthletesPage';
import AthleteProfilePage from './pages/AthleteProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import BiomechanicsPage from './pages/BiomechanicsPage';
import RecoveryPage from './pages/RecoveryPage';
import InjuryRiskPage from './pages/InjuryRiskPage';
import TeamPage from './pages/TeamPage';
import ReportsPage from './pages/ReportsPage';
import MatchReportPage from './pages/MatchReportPage';
import WearablesPage from './pages/WearablesPage';
import SettingsPage from './pages/SettingsPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Private / Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-v2"
          element={
            <ProtectedRoute>
              <DashboardV2Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/athletes"
          element={
            <ProtectedRoute>
              <AthletesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/athletes/:id"
          element={
            <ProtectedRoute>
              <AthleteProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/biomechanics"
          element={
            <ProtectedRoute>
              <BiomechanicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recovery"
          element={
            <ProtectedRoute>
              <RecoveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/injury-risk"
          element={
            <ProtectedRoute>
              <InjuryRiskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/match"
          element={
            <ProtectedRoute>
              <MatchReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wearables"
          element={
            <ProtectedRoute>
              <WearablesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
