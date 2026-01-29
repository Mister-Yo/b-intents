import { Text } from "@radix-ui/themes";
import { useState } from "react";

import { useConnectWallet } from "@/hooks/useConnectWallet";
import type { BlockchainEnum } from "@/types/network";
import { toDefuseAuthMethod } from "@/types/wallet";

import WalletConnectionsConnector from "./WalletConnectionsConnector";

const WalletConnections = () => {
  const { state, disconnect, connector } = useConnectWallet();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const activeWallet = connector.wallets[0] ?? null;

  const handleCopy = (address: string) => {
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 1000);
  };

  const userAddress = state.address;
  const defuseAuthMethod = toDefuseAuthMethod(state.authMethod);

  if (!userAddress || !defuseAuthMethod) return null;

  const chainLabel = state.network ?? "";
  const isCopied = copiedAddress === chainLabel;

  return (
    <div className="flex flex-col">
      <Text className="pb-2 font-bold text-xl">Connected with</Text>

      <WalletConnectionsConnector
        accountId={userAddress}
        authMethod={defuseAuthMethod}
        chainLabel={chainLabel as BlockchainEnum}
        isCopied={isCopied}
        onCopy={() => handleCopy(chainLabel)}
        onDisconnect={disconnect}
        wallet={activeWallet}
      />
    </div>
  );
};

export default WalletConnections;
