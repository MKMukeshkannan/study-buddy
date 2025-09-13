import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  role: 'STAFF' | 'STUDENT';
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  resetUser: () => void;
  getUser: () => User | null;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user: User) => set({ user }),

      resetUser: () => set({ user: null }),

      getUser: () => get().user,
    }),
    {
      name: 'user-storage', // key in localStorage
    }
  )
);

