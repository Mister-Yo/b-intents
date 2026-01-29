import { GetExecutionStatusResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SwapHistoryItem = {
  depositAddress: string;
  createdAt: number;
  userAddress: string;
  status: GetExecutionStatusResponse.status;
  tokenInAssetId: string;
  tokenOutAssetId: string;
  amountIn: string;
  amountOut: string;
};

type State = {
  swaps: SwapHistoryItem[];
};

type Actions = {
  addSwap: (swap: Omit<SwapHistoryItem, "createdAt" | "status">) => void;
  updateSwapStatus: (depositAddress: string, status: GetExecutionStatusResponse.status, amountIn?: string, amountOut?: string) => void;
  getSwapsForUser: (userAddress: string | null) => SwapHistoryItem[];
  hasPendingSwaps: (userAddress: string | null) => boolean;
};

type Store = State & Actions;

const TERMINAL_STATUSES = [
  GetExecutionStatusResponse.status.SUCCESS,
  GetExecutionStatusResponse.status.REFUNDED,
  GetExecutionStatusResponse.status.FAILED,
];

// Keep history for 7 days
const HISTORY_TTL = 7 * 24 * 60 * 60 * 1000;
// Max items to keep
const MAX_HISTORY_ITEMS = 50;

export const useSwapHistoryStore = create<Store>()(
  persist(
    (set, get) => ({
      swaps: [],

      addSwap: (swap) => {
        set((state) => {
          // Avoid duplicates
          if (state.swaps.some((s) => s.depositAddress === swap.depositAddress)) {
            return state;
          }
          const newSwaps = [
            {
              ...swap,
              createdAt: Date.now(),
              status: GetExecutionStatusResponse.status.PROCESSING,
            },
            ...state.swaps,
          ].slice(0, MAX_HISTORY_ITEMS);

          return { swaps: newSwaps };
        });
      },

      updateSwapStatus: (depositAddress, status, amountIn, amountOut) => {
        set((state) => ({
          swaps: state.swaps.map((s) =>
            s.depositAddress === depositAddress
              ? {
                  ...s,
                  status,
                  amountIn: amountIn ?? s.amountIn,
                  amountOut: amountOut ?? s.amountOut,
                }
              : s
          ),
        }));
      },

      getSwapsForUser: (userAddress) => {
        if (!userAddress) return [];
        const now = Date.now();
        return get().swaps.filter(
          (s) => s.userAddress === userAddress && now - s.createdAt < HISTORY_TTL
        );
      },

      hasPendingSwaps: (userAddress) => {
        if (!userAddress) return false;
        return get().swaps.some(
          (s) =>
            s.userAddress === userAddress &&
            !TERMINAL_STATUSES.includes(s.status)
        );
      },
    }),
    {
      name: "1click-swap-history",
      version: 1,
    }
  )
);
