import { type BaseTokenInfo, isBaseToken, type UnifiedTokenInfo } from "@defuse-protocol/defuse-sdk";

import { LIST_TOKENS } from "@/constants/tokens";

export const safeTokenList = filterTokenWithDifferentDecimals(LIST_TOKENS);

export function filterTokenWithDifferentDecimals(tokenList: (BaseTokenInfo | UnifiedTokenInfo)[]) {
  return tokenList.filter((token) => {
    if (isBaseToken(token)) {
      return true;
    }

    const decimals = token.groupedTokens.map((t) => t.decimals);
    return new Set(decimals).size === 1;
  });
}
