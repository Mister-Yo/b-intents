import { useHotConnector } from "@/providers/hot-connector-provider";
import type { WalletMessage, WalletSignatureResult } from "@/types/walletMessages";

import { useConnectWallet } from "./useConnectWallet";

export function useWalletAgnosticSignMessage() {
  const { state } = useConnectWallet();
  const connector = useHotConnector();

  return async <T>(walletMessage: WalletMessage<T>): Promise<WalletSignatureResult<T>> => {
    const authMethod = state.authMethod;
    const activeWallet = connector.wallets[0];

    if (!activeWallet) {
      throw new Error("User not signed in");
    }

    switch (authMethod) {
      case "evm": {
        // Use HotConnector's signIntents for EVM
        const commitment = await activeWallet.signIntents([
          { type: "auth", message: walletMessage.ERC191.message },
        ]);
        return {
          type: "ERC191",
          signatureData: commitment.signature,
          signedData: walletMessage.ERC191,
        };
      }

      case "near": {
        // Use HotConnector's signIntents for NEAR (NEP413)
        const commitment = await activeWallet.signIntents(
          [{ type: "auth", message: walletMessage.NEP413.message }],
          { nonce: walletMessage.NEP413.nonce },
        );
        return {
          type: "NEP413",
          signatureData: {
            accountId: activeWallet.address,
            publicKey: commitment.public_key ?? "",
            signature: commitment.signature,
          },
          signedData: walletMessage.NEP413,
        };
      }

      case "solana": {
        // Use HotConnector's signIntents for Solana
        const commitment = await activeWallet.signIntents([
          { type: "auth", message: Array.from(walletMessage.SOLANA.message) },
        ]);
        return {
          type: "SOLANA",
          signatureData: new Uint8Array(
            typeof commitment.signature === "string"
              ? Buffer.from(commitment.signature, "base64")
              : commitment.signature,
          ),
          signedData: walletMessage.SOLANA,
        };
      }

      case undefined:
        throw new Error("User not signed in");

      default:
        throw new Error(`Unsupported sign in type: ${authMethod}`);
    }
  };
}
