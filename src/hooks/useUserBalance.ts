import { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { useQuery } from "@tanstack/react-query";

import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { toDefuseAuthMethod } from "@/types/wallet";
import { authMethodToBlockchain } from "@/utils";

import { useConnectWallet } from "./useConnectWallet";

const useUserBalance = (
  params: {
    address: string | null;
    blockchain: TokenResponse.blockchain;
    tokenAddress: string;
    defuseAssetId: string;
  } | null,
) => {
  const {
    state: { authMethod },
    getBalance,
  } = useConnectWallet();
  const loadingTokenUpdater = useOneClickSwapStore((state) => state.loadingTokenUpdater);

  return useQuery<{
    balance: bigint;
    nearBalance?: bigint;
  } | null>({
    queryKey: ["balance", params, authMethod],
    queryFn: async () => {
      if (!params?.address || !authMethod) return null;
      const { address, tokenAddress, blockchain, defuseAssetId } = params;

      // Use HotConnector's getBalance with unified params
      return getBalance({ userAddress: address, blockchain, tokenAddress, defuseAssetId });
    },
    enabled:
      !!params &&
      !!params?.address &&
      !!authMethod &&
      authMethodToBlockchain(toDefuseAuthMethod(authMethod))?.includes(params.blockchain) &&
      !loadingTokenUpdater,
    refetchOnWindowFocus: true,
    staleTime: 30_000, // Consider balance stale after 30 seconds
  });
};

export default useUserBalance;
