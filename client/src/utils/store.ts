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



export interface FlashCard {
  id: string;
  question: string;
  answer: string;
}

interface FlashCardState {
  students: Record<string, FlashCard[]>; // studentId -> flashcards
  addCard: (studentId: string, card: FlashCard) => void;
  removeCard: (studentId: string, cardId: string) => void;
  getCards: (studentId: string) => FlashCard[];
}

export const useFlashCardStore = create<FlashCardState>()(
  persist(
    (set, get) => ({
      students: {},

      addCard: (studentId, card) =>
        set((state) => {
          const cards = state.students[studentId] || [];
          return {
            students: {
              ...state.students,
              [studentId]: [...cards, card],
            },
          };
        }),

      removeCard: (studentId, cardId) =>
        set((state) => {
          const cards = state.students[studentId] || [];
          return {
            students: {
              ...state.students,
              [studentId]: cards.filter((c) => c.id !== cardId),
            },
          };
        }),

      getCards: (studentId) => {
        return get().students[studentId] || [];
      },
    }),
    {
      name: "flashcard-storage", // key in localStorage
    }
  )
);
