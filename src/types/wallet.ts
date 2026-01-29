import type { AuthMethod as DefuseAuthMethod } from "@defuse-protocol/defuse-sdk";
import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";

// Extended AuthMethod that includes all wallet types from HotConnector
export type AuthMethod = DefuseAuthMethod | "ton" | "stellar" | "cosmos";

// Convert extended AuthMethod to DefuseAuthMethod for SDK compatibility
export const toDefuseAuthMethod = (method: AuthMethod | undefined): DefuseAuthMethod | undefined => {
  if (!method) return undefined;
  if (method === "ton" || method === "stellar" || method === "cosmos") {
    return undefined; // These are not supported by Defuse SDK
  }
  return method as DefuseAuthMethod;
};

export type State = {
  authMethod?: AuthMethod;
  network?: string;
  address?: string;
  isVerified: boolean;
};

export type BalanceRequest = {
  defuseAssetId: string;
  userAddress: string;
  tokenAddress: string;
  blockchain: TokenResponse.blockchain;
};

export type BalanceResponse = { balance: bigint; nearBalance?: bigint };

export type TransferAmountParams = {
  depositAddress: string;
  defuseAssetId: string;
  amount: bigint;
  balance: BalanceResponse;
  blockchain: TokenResponse.blockchain;
  tokenAddress: string;
};
