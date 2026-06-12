import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateRecoveryTrends } from '../utils/generateMockData';
import recoveryData from '../data/recovery.json';

interface RecoveryStore {
  current: typeof recoveryData.current;
  readinessStatus: string;
  recommendations: typeof recoveryData.recommendations;
  weeklyTrend: ReturnType<typeof generateRecoveryTrends>;
  refresh: () => void;
}

export const useRecoveryStore = create<RecoveryStore>()(
  persist(
    (set) => ({
      current: recoveryData.current,
      readinessStatus: recoveryData.readinessStatus,
      recommendations: recoveryData.recommendations,
      weeklyTrend: generateRecoveryTrends(),
      refresh: () => set({ weeklyTrend: generateRecoveryTrends() }),
    }),
    { name: 'axiom-recovery' }
  )
);
