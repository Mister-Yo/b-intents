import { DepositWidget } from "@defuse-protocol/defuse-sdk";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

const Deposit = () => {
  const { state, connector } = useConnectWallet();
  const activeWallet = connector.wallets[0];

  const handleSendTransaction = async (tx: unknown): Promise<string> => {
    if (!activeWallet) {
      throw new Error("No wallet connected");
    }

    const result = await activeWallet.sendTransaction(tx);

    if (typeof result === "string") {
      return result;
    }

    if (result && typeof result === "object" && "transaction" in result) {
      const txResult = result as { transaction?: { hash?: string } };
      return txResult.transaction?.hash ?? "";
    }

    throw new Error("Transaction failed");
  };

  return (
    <>
      <Helmet>
        <title>Deposit Tokens | NEAR Intents</title>
        <meta
          name="description"
          content="Deposit tokens from Ethereum, Solana, Base, and other blockchains into NEAR Intents. Fast and secure cross-chain deposits."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <DepositWidget
          chainType={toDefuseAuthMethod(state.authMethod)}
          renderHostAppLink={renderAppLink}
          sendTransactionEVM={async ({ from, ...tx }) => {
            const hash = await handleSendTransaction({
              ...tx,
              account: from,
            });
            return hash as `0x${string}`;
          }}
          sendTransactionNear={handleSendTransaction}
          sendTransactionSolana={handleSendTransaction}
          tokenList={LIST_TOKENS}
          userAddress={state.isVerified ? state.address : undefined}
        />
      </Paper>
    </>
  );
};

export default Deposit;
