import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  role: string;
  organization: string;
  email: string;
}

interface AuthStore {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const MOCK_USER: User = {
  id: 1,
  name: 'Coach Yacine',
  role: 'Performance Coach',
  organization: 'AXIOM Sports Lab',
  email: 'coach@axiomsports.ai',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (email: string, password: string) => {
        if (email === 'coach@axiomsports.ai' && password === 'Axiom2026') {
          set({ isLoggedIn: true, user: MOCK_USER });
          return true;
        }
        return false;
      },
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    { name: 'axiom-auth' }
  )
);
