import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import athletesData from '../data/athletes.json';

export type Athlete = typeof athletesData[0];

interface AthleteStore {
  athletes: Athlete[];
  selectedAthleteId: number | null;
  selectAthlete: (id: number) => void;
  clearSelection: () => void;
  getAthlete: (id: number) => Athlete | undefined;
}

export const useAthleteStore = create<AthleteStore>()(
  persist(
    (set, get) => ({
      athletes: athletesData as Athlete[],
      selectedAthleteId: null,
      selectAthlete: (id: number) => set({ selectedAthleteId: id }),
      clearSelection: () => set({ selectedAthleteId: null }),
      getAthlete: (id: number) => get().athletes.find(a => a.id === id),
    }),
    { name: 'axiom-athletes' }
  )
);
