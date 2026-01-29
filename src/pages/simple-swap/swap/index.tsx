import { SwapWidget } from "@defuse-protocol/defuse-sdk";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useWalletAgnosticSignMessage } from "@/hooks/useWalletAgnosticSignMessage";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

const Swap = observer(() => {
  const { state, connector } = useConnectWallet();
  const signMessage = useWalletAgnosticSignMessage();

  const activeWallet = connector.wallets[0];

  return (
    <>
      <Helmet>
        <title>Simple Swap | NEAR Intents</title>
        <meta
          name="description"
          content="Swap tokens directly on NEAR Protocol. Simple, fast, and secure token swaps powered by NEAR Intents."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <SwapWidget
          onSuccessSwap={() => {}}
          renderHostAppLink={renderAppLink}
          sendNearTransaction={async (tx) => {
            if (!activeWallet) {
              throw new Error("No wallet connected");
            }

            // Use HotConnector to send NEAR transaction
            const result = await activeWallet.sendTransaction(tx);

            if (typeof result === "string") {
              return { txHash: result };
            }

            // Handle object result with transaction hash
            if (result && typeof result === "object" && "transaction" in result) {
              const txResult = result as { transaction?: { hash?: string } };
              return { txHash: txResult.transaction?.hash ?? "" };
            }

            throw new Error("No outcome");
          }}
          signMessage={(params) => signMessage(params)}
          tokenList={LIST_TOKENS}
          userAddress={(state.isVerified ? state.address : undefined) ?? null}
          userChainType={toDefuseAuthMethod(state.authMethod) ?? null}
        />
      </Paper>
    </>
  );
});

export default Swap;
