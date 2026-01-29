import type { AuthMethod as DefuseAuthMethod } from "@defuse-protocol/defuse-sdk";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { tokenPairs } from "@/constants/tokenPairs";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { toDefuseAuthMethod } from "@/types/wallet";

const TokensUpdater = observer(() => {
  const {
    state: { authMethod },
  } = useConnectWallet();
  const { changeToken, tokensMap, setLoadingTokenUpdater } = useOneClickSwapStore();

  useEffect(() => {
    const defuseAuthMethod = toDefuseAuthMethod(authMethod);
    if (!defuseAuthMethod) return;

    const [tokenInKey, tokenOutKey] = tokenPairs[defuseAuthMethod as DefuseAuthMethod] || [];
    const initialTokenIn = tokensMap[tokenInKey];
    const initialTokenOut = tokensMap[tokenOutKey];

    if (initialTokenIn) changeToken({ type: "in", token: initialTokenIn });
    if (initialTokenOut) changeToken({ type: "out", token: initialTokenOut });
    if (initialTokenIn && initialTokenOut) setLoadingTokenUpdater(false);
  }, [authMethod, changeToken, setLoadingTokenUpdater, tokensMap]);

  return null;
});

export default TokensUpdater;
