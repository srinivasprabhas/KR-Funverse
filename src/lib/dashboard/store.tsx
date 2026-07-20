"use client";

import * as React from "react";
import type {
  Booking,
  Court,
  DashboardState,
  Game,
  GameAttribute,
  SlotTime,
} from "./types";
import { INITIAL_STATE, SEED_GAMES, buildSeedBookings } from "./seed";
import { findConflict, todayISO } from "./availability";

const STORAGE_KEY = "krf-admin-state-v1";

type Action =
  | { type: "HYDRATE"; state: DashboardState }
  | { type: "ADD_GAME"; game: Game }
  | { type: "UPDATE_GAME"; game: Game }
  | { type: "DELETE_GAME"; gameId: string }
  | { type: "ADD_BOOKING"; booking: Booking }
  | { type: "UPDATE_BOOKING"; booking: Booking }
  | { type: "CANCEL_BOOKING"; bookingId: string; at: string }
  | { type: "RESET_DEMO"; state: DashboardState };

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "HYDRATE":
    case "RESET_DEMO":
      return action.state;

    case "ADD_GAME":
      return { ...state, games: [...state.games, action.game] };

    case "UPDATE_GAME":
      return {
        ...state,
        games: state.games.map((g) => (g.id === action.game.id ? action.game : g)),
      };

    case "DELETE_GAME":
      return {
        ...state,
        games: state.games.filter((g) => g.id !== action.gameId),
        bookings: state.bookings.filter((b) => b.gameId !== action.gameId),
      };

    case "ADD_BOOKING": {
      // Last line of defence. The form already disables taken courts, but the
      // reducer re-checks so no code path can create a double booking.
      const clash = findConflict(state.bookings, action.booking);
      if (clash) return state;
      return { ...state, bookings: [...state.bookings, action.booking] };
    }

    case "UPDATE_BOOKING": {
      const clash = findConflict(state.bookings, {
        ...action.booking,
        ignoreBookingId: action.booking.id,
      });
      if (clash) return state;
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.booking.id ? action.booking : b
        ),
      };
    }

    case "CANCEL_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? { ...b, status: "cancelled" as const, cancelledAt: action.at }
            : b
        ),
      };

    default:
      return state;
  }
}

interface StoreValue {
  state: DashboardState;
  dispatch: React.Dispatch<Action>;
  /** False until localStorage has been read. Gate date-dependent UI on this. */
  hydrated: boolean;
  /** "yyyy-MM-dd" for today. Empty string before hydration. */
  today: string;
  gameById: (id: string) => Game | undefined;
  courtById: (gameId: string, courtId: string) => Court | undefined;
}

const StoreContext = React.createContext<StoreValue | null>(null);

export function BookingStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [hydrated, setHydrated] = React.useState(false);
  const [today, setToday] = React.useState("");

  // Read persisted state once, on the client only. Until this runs the tree
  // renders from INITIAL_STATE, which is identical on server and client.
  React.useEffect(() => {
    const now = new Date();
    setToday(todayISO());

    let next: DashboardState | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DashboardState;
        if (Array.isArray(parsed?.games) && Array.isArray(parsed?.bookings)) {
          next = parsed;
        }
      }
    } catch {
      // Corrupt or unavailable storage — fall through to a fresh seed.
    }

    dispatch({
      type: "HYDRATE",
      state: next ?? { games: SEED_GAMES, bookings: buildSeedBookings(now) },
    });
    setHydrated(true);
  }, []);

  // Persist after every change, but never before hydration or we'd overwrite
  // saved state with the empty initial state.
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked — the demo still works in memory.
    }
  }, [state, hydrated]);

  const value = React.useMemo<StoreValue>(
    () => ({
      state,
      dispatch,
      hydrated,
      today,
      gameById: (id) => state.games.find((g) => g.id === id),
      courtById: (gameId, courtId) =>
        state.games.find((g) => g.id === gameId)?.courts.find((c) => c.id === courtId),
    }),
    [state, hydrated, today]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside BookingStoreProvider");
  return ctx;
}

/** Resets to a freshly seeded demo — handy when demoing repeatedly. */
export function useResetDemo() {
  const { dispatch } = useStore();
  return React.useCallback(() => {
    dispatch({
      type: "RESET_DEMO",
      state: { games: SEED_GAMES, bookings: buildSeedBookings(new Date()) },
    });
  }, [dispatch]);
}

export const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export type { Action, Court, Game, GameAttribute, SlotTime };
