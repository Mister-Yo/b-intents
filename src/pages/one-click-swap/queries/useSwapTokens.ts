import { OneClickService } from "@defuse-protocol/one-click-sdk-typescript";
import { useQuery } from "@tanstack/react-query";

import { blockchainOrder, NATIVE_TOKENS_BY_DEFUSE_ID } from "@/constants/tokens";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";

const useSwapTokens = () => {
  const setTokens = useOneClickSwapStore((state) => state.setTokens);

  return useQuery({
    queryKey: ["one-click-tokens"],
    queryFn: async () => {
      const response = await OneClickService.getTokens();
      const tokens = response
        .filter(
          (token) =>
            blockchainOrder.includes(token.blockchain) &&
            (NATIVE_TOKENS_BY_DEFUSE_ID[token.blockchain] === token.assetId || token.contractAddress),
        )
        .sort((a, b) => {
          const blockchainIndexA = blockchainOrder.indexOf(a.blockchain);
          const blockchainIndexB = blockchainOrder.indexOf(b.blockchain);
          return blockchainIndexA - blockchainIndexB;
        });

      setTokens(tokens);
      return tokens;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

export default useSwapTokens;
