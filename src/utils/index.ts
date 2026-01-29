import { AuthMethod } from "@defuse-protocol/defuse-sdk";
import { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";

import { NATIVE_TOKENS_BY_DEFUSE_ID, TOKEN_SYMBOL_OVERRIDE } from "@/constants/tokens";

type KeyType = string | number | symbol;

// biome-ignore lint/suspicious/noExplicitAny: explanation
export const toMap = <T extends Record<KeyType, any>, K extends keyof T>(
  array: Array<T>,
  keyName: K,
): Record<T[K], T> =>
  array.reduce(
    (acc, item) => ({
      ...acc,
      [item[keyName]]: item,
    }),
    {} as Record<T[K], T>,
  );

export const authMethodToBlockchain = (authMethod?: AuthMethod) => {
  switch (authMethod) {
    case AuthMethod.Near:
      return [TokenResponse.blockchain.NEAR];
    case AuthMethod.Solana:
      return [TokenResponse.blockchain.SOL];
    case AuthMethod.EVM:
      return [
        TokenResponse.blockchain.ETH,
        TokenResponse.blockchain.BASE,
        TokenResponse.blockchain.ARB,
        TokenResponse.blockchain.GNOSIS,
        TokenResponse.blockchain.POL,
        TokenResponse.blockchain.BSC,
        TokenResponse.blockchain.BERA,
        // TokenResponse.blockchain.AURORA,
        // TokenResponse.blockchain.TURBOCHAIN,
      ];
    default:
      return null;
  }
};

export const isNativeToken = (blockchain: TokenResponse.blockchain, defuseAssetId: string) => {
  return NATIVE_TOKENS_BY_DEFUSE_ID[blockchain] === defuseAssetId;
};

/**
 * Get display symbol for token (handles overrides like wNEAR -> NEAR)
 */
export const getTokenSymbol = (token: { assetId: string; symbol: string } | null | undefined): string => {
  if (!token) return "";
  return TOKEN_SYMBOL_OVERRIDE[token.assetId] ?? token.symbol;
};
