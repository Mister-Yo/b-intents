import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useHotConnector } from "@/providers/hot-connector-provider";

export type TokenBalanceMap = Record<string, { balance: bigint; decimals: number }>;

/**
 * Hook that fetches all token balances for the connected wallet
 * and returns a map of assetId -> { balance, decimals }.
 *
 * Uses the same per-token balance lookup as useConnectWallet.getBalance():
 * activeWallet.getBalance(token.id) with fetchToken fallback.
 * Must be used within an observer() component for MobX reactivity.
 */
export const useTokenBalances = (): { balances: TokenBalanceMap; refetch: () => void } => {
  const connector = useHotConnector();
  const activeWallet = connector.wallets[0] ?? null;
  const fetchedRef = useRef(false);
  const [fetchedBalances, setFetchedBalances] = useState<TokenBalanceMap>({});
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchAll = useCallback(async () => {
    if (!activeWallet) return;

    const map: TokenBalanceMap = {};

    // First, trigger batch fetch to populate cache
    await connector.fetchTokens(activeWallet).catch(console.error);

    // Then read balances using the same approach as useConnectWallet.getBalance
    for (const token of connector.tokens) {
      try {
        let balance = activeWallet.getBalance(token.id);

        // If cached balance is 0, try fetching individually
        if (balance === 0n) {
          balance = await connector.fetchToken(token, activeWallet);
        }

        if (balance > 0n) {
          map[token.info.assetId] = {
            balance,
            decimals: token.decimals,
          };
        }
      } catch {
        // Skip tokens that fail to fetch
      }
    }

    setFetchedBalances(map);
  }, [activeWallet, connector]);

  // Fetch balances for all tokens when wallet connects
  useEffect(() => {
    if (!activeWallet || fetchedRef.current) return;
    fetchedRef.current = true;
    fetchAll();

    return () => {
      fetchedRef.current = false;
    };
  }, [activeWallet, fetchAll]);

  // Re-fetch when trigger changes (called by refetch())
  useEffect(() => {
    if (fetchTrigger === 0) return;
    fetchAll();
  }, [fetchTrigger, fetchAll]);

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  // Also build a live map from cached wallet balances for reactivity
  const liveMap = useMemo((): TokenBalanceMap => {
    if (!activeWallet) return {};

    const map: TokenBalanceMap = {};
    for (const token of connector.tokens) {
      const balance = activeWallet.getBalance(token.id);
      if (balance > 0n) {
        map[token.info.assetId] = {
          balance,
          decimals: token.decimals,
        };
      }
    }
    return map;
  }, [activeWallet, connector.tokens, connector.walletsTokens]);

  // Merge: prefer live (reactive) data, fall back to fetched data
  const balances = useMemo(() => {
    const hasLiveData = Object.keys(liveMap).length > 0;
    if (hasLiveData) return liveMap;
    return fetchedBalances;
  }, [liveMap, fetchedBalances]);

  return { balances, refetch };
};
