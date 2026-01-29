import { WalletType } from "@hot-labs/kit";
import { useMemo } from "react";

import { useHotConnector } from "@/providers/hot-connector-provider";
import { useVerifiedWalletsStore } from "@/stores/useVerifiedWalletsStore";
import type { AuthMethod, BalanceRequest, BalanceResponse, State, TransferAmountParams } from "@/types/wallet";

const walletTypeToAuthMethod = (type: WalletType): AuthMethod => {
  switch (type) {
    case WalletType.NEAR:
      return "near";
    case WalletType.EVM:
      return "evm";
    case WalletType.SOLANA:
      return "solana";
    case WalletType.TON:
      return "ton";
    case WalletType.STELLAR:
      return "stellar";
    case WalletType.COSMOS:
      return "cosmos";
    default:
      return "evm";
  }
};

interface ConnectWalletAction {
  connect: () => void;
  disconnect: () => void;
  state: State;
  getBalance: (params: BalanceRequest) => Promise<BalanceResponse | null>;
  transferAmount: (params: TransferAmountParams) => Promise<string | null>;
  connector: ReturnType<typeof useHotConnector>;
}

const defaultState: State = {
  authMethod: undefined,
  network: undefined,
  address: undefined,
  isVerified: true,
};

export const useConnectWallet = (): ConnectWalletAction => {
  const connector = useHotConnector();

  // Get the first connected wallet (if any)
  const activeWallet = connector.wallets[0] ?? null;

  const currentState: State = useMemo(() => {
    if (!activeWallet) {
      return defaultState;
    }

    return {
      authMethod: walletTypeToAuthMethod(activeWallet.type),
      network: `${walletTypeToAuthMethod(activeWallet.type)}:mainnet`,
      address: activeWallet.address,
      isVerified: true, // HotConnector handles verification internally
    };
  }, [activeWallet]);

  const isVerified = useVerifiedWalletsStore((store) =>
    currentState.address != null ? store.walletAddresses.includes(currentState.address) : true,
  );

  const state = useMemo(
    () => ({
      ...currentState,
      isVerified,
    }),
    [currentState, isVerified],
  );

  const connect = () => {
    connector.connect(); // Opens wallet selector UI
  };

  const disconnect = () => {
    if (activeWallet) {
      connector.disconnect(activeWallet);
    }
  };

  const getBalance = async (params: BalanceRequest): Promise<BalanceResponse | null> => {
    if (!activeWallet) return null;

    try {
      // Find the token in connector's tokens list using defuseAssetId
      const token = connector.tokens.find((t) => t.info.assetId === params.defuseAssetId);
      if (!token) {
        console.warn("Token not found:", params.defuseAssetId);
        return null;
      }

      // Use token.id format (chain:address) for balance lookup
      let balance = activeWallet.getBalance(token.id);

      // If no cached balance, fetch it
      if (balance === 0n) {
        balance = await connector.fetchToken(token, activeWallet);
      }

      return { balance };
    } catch (error) {
      console.error("Failed to get balance:", error);
      return null;
    }
  };

  const transferAmount = async (params: TransferAmountParams): Promise<string | null> => {
    if (!activeWallet) return null;

    try {
      // Find the token in connector's tokens list using defuseAssetId
      const token = connector.tokens.find((t) => t.info.assetId === params.defuseAssetId);
      if (!token) {
        console.error("Token not found for transfer:", params.defuseAssetId);
        return null;
      }

      // Get gas fee estimate first
      const gasFee = await activeWallet.transferFee(token, params.depositAddress, params.amount);

      // Use OmniWallet.transfer method with gasFee
      const txHash = await activeWallet.transfer({
        token,
        receiver: params.depositAddress,
        amount: params.amount,
        gasFee,
      });

      return txHash;
    } catch (error) {
      console.error("Transfer failed:", error);
      return null;
    }
  };

  return {
    connect,
    disconnect,
    state,
    getBalance,
    transferAmount,
    connector,
  };
};
