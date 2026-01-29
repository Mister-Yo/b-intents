import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { create } from "zustand";

import { toMap } from "@/utils";

export type ChangeTokenFn = { type: "in" | "out"; token: TokenResponse } | { type: "direction"; token?: never };
export type ChangeBlockchainFn = { type: "in" | "out"; blockchain: TokenResponse.blockchain };

type State = {
  tokens: TokenResponse[];
  tokensMap: Record<string, TokenResponse>;
  tokenIn: TokenResponse | null;
  tokenOut: TokenResponse | null;
  loadingTokenUpdater: boolean;
};

type Actions = {
  setTokens: (tokens: TokenResponse[]) => void;
  changeToken: (params: ChangeTokenFn) => void;
  changeBlockchain: (params: ChangeBlockchainFn) => void;
  setLoadingTokenUpdater: (loadingTokenUpdater: boolean) => void;
};

type Store = State & Actions;

export const useOneClickSwapStore = create<Store>()((set) => ({
  tokens: [],
  tokensMap: {},
  tokenIn: null,
  tokenOut: null,
  loadingTokenUpdater: true,

  setTokens: (tokens) => {
    set({ tokens, tokenIn: tokens[0], tokenOut: tokens[1], tokensMap: toMap(tokens, "assetId") });
  },

  changeToken: ({ type, token }: ChangeTokenFn) => {
    set((state) => {
      let tokenIn = state.tokenIn;
      let tokenOut = state.tokenOut;

      switch (type) {
        case "in":
          tokenIn = token;
          break;

        case "out":
          tokenOut = token;
          break;

        case "direction":
          tokenIn = state.tokenOut;
          tokenOut = state.tokenIn;
          break;
      }

      return {
        ...state,
        tokenIn,
        tokenOut,
      };
    });
  },

  changeBlockchain: ({ type, blockchain }: ChangeBlockchainFn) => {
    set((state) => {
      const tokensOnBlockchain = state.tokens.filter((t) => t.blockchain === blockchain);
      const firstToken = tokensOnBlockchain[0] || null;

      if (type === "in") {
        return { ...state, tokenIn: firstToken };
      }
      return { ...state, tokenOut: firstToken };
    });
  },

  setLoadingTokenUpdater: (loadingTokenUpdater) => {
    set((state) => ({ ...state, loadingTokenUpdater }));
  },
}));
