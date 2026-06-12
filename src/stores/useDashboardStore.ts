import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateAIInsights, type AIInsight } from '../utils/generateMockData';
import dashboardData from '../data/dashboard.json';

interface DashboardStore {
  commandCenter: typeof dashboardData.commandCenter;
  kpis: typeof dashboardData.kpis;
  recentActivity: typeof dashboardData.recentActivity;
  insights: AIInsight[];
  refreshInsights: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      commandCenter: dashboardData.commandCenter,
      kpis: dashboardData.kpis,
      recentActivity: dashboardData.recentActivity,
      insights: generateAIInsights(8),
      refreshInsights: () => set({ insights: generateAIInsights(8) }),
    }),
    { name: 'axiom-dashboard' }
  )
);
