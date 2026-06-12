import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateWeeklyTrends, generateAthleteProgression } from '../utils/generateMockData';
import analyticsData from '../data/analytics.json';

interface AnalyticsStore {
  weeklyTrends: ReturnType<typeof generateWeeklyTrends>;
  progression: ReturnType<typeof generateAthleteProgression>;
  percentileRankings: typeof analyticsData.percentileRankings;
  comparison: typeof analyticsData.comparison;
  activePeriod: 'week' | 'month' | 'season';
  setPeriod: (p: 'week' | 'month' | 'season') => void;
  refresh: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      weeklyTrends: generateWeeklyTrends(),
      progression: generateAthleteProgression(8),
      percentileRankings: analyticsData.percentileRankings,
      comparison: analyticsData.comparison,
      activePeriod: 'week',
      setPeriod: (p) => set({ activePeriod: p }),
      refresh: () => set({ weeklyTrends: generateWeeklyTrends(), progression: generateAthleteProgression(8) }),
    }),
    { name: 'axiom-analytics' }
  )
);
