import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Database } from "@/lib/types/db";

export type AuthSession = {
  accessToken: string;
  expiresAt: number;
  userId: string;
};

type UserStoreState = {
  session: AuthSession | null;
  cachedBookings: Array<{ id: string; flightId: string; status: string; pnrCode: string }>;
  setSession: (session: AuthSession | null) => void;
  setCachedBookings: (bookings: UserStoreState["cachedBookings"]) => void;
  clearUserStore: () => void;
};

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      session: null,
      cachedBookings: [],
      setSession: (session) => set({ session }),
      setCachedBookings: (bookings) => set({ cachedBookings: bookings }),
      clearUserStore: () => set({ session: null, cachedBookings: [] })
    }),
    {
      name: "flight-user-store",
      partialize: (state) => ({
        session: state.session ? { userId: state.session.userId, expiresAt: state.session.expiresAt } : null,
        cachedBookings: state.cachedBookings
      })
    }
  )
);
