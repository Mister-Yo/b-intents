import { useEffect, useRef } from "react";
import { useParams } from "react-router";

import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { findTokenMatch, parseSwapPairParam } from "@/utils/swapPairParser";

/**
 * Reads the :pair param from the URL (e.g., "eth-to-usdc")
 * and pre-populates the swap store with the matching tokens
 * once the token list is loaded.
 */
const useSwapPairFromUrl = () => {
  const { pair } = useParams<{ pair: string }>();
  const { tokens, changeToken } = useOneClickSwapStore();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!pair || tokens.length === 0 || appliedRef.current) return;

    const parsed = parseSwapPairParam(pair);
    if (!parsed) return;

    const tokenIn = findTokenMatch(parsed.from, tokens);
    const tokenOut = findTokenMatch(parsed.to, tokens);

    if (tokenIn) {
      changeToken({ type: "in", token: tokenIn });
    }
    if (tokenOut) {
      changeToken({ type: "out", token: tokenOut });
    }

    appliedRef.current = true;
  }, [pair, tokens, changeToken]);

  return { pair };
};

export default useSwapPairFromUrl;
