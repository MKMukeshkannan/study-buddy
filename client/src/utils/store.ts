import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface UserState extends User {
  // Getters
  getId: () => string;
  getName: () => string;
  getEmail: () => string;
  getRole: () => Role;

  // Setters
  setId: (id: string) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: Role) => void;
  setUser: (user: User) => void;

  // Reset
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      id: "",
      name: "",
      email: "",
      role: "student", // default

      // Getters
      getId: () => get().id,
      getName: () => get().name,
      getEmail: () => get().email,
      getRole: () => get().role,

      // Setters
      setId: (id) => set({ id }),
      setName: (name) => set({ name }),
      setEmail: (email) => set({ email }),
      setRole: (role) => set({ role }),
      setUser: (user) => set(user),

      // Reset
      reset: () =>
        set({
          id: "",
          name: "",
          email: "",
          role: "student",
        }),
    }),
    {
      name: "user-storage", // localStorage key
    }
  )
);
