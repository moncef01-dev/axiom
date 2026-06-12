import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import reportsData from '../data/reports.json';

export type Report = typeof reportsData.reports[0];
type ReportStatus = 'idle' | 'generating' | 'ready';

interface ReportStore {
  reports: Report[];
  reportStatuses: Record<string, ReportStatus>;
  activeReportId: string | null;
  setStatus: (id: string, status: ReportStatus) => void;
  setActiveReport: (id: string | null) => void;
  generateReport: (id: string) => void;
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, _get) => ({
      reports: reportsData.reports as Report[],
      reportStatuses: {},
      activeReportId: null,
      setStatus: (id, status) =>
        set(s => ({ reportStatuses: { ...s.reportStatuses, [id]: status } })),
      setActiveReport: (id) => set({ activeReportId: id }),
      generateReport: (id) => {
        set(s => ({ reportStatuses: { ...s.reportStatuses, [id]: 'generating' } }));
        setTimeout(() => {
          set(s => ({ reportStatuses: { ...s.reportStatuses, [id]: 'ready' } }));
        }, 2200);
      },
    }),
    { name: 'axiom-reports' }
  )
);
