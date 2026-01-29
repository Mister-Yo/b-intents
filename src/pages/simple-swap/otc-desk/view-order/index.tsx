import { OtcTakerWidget } from "@defuse-protocol/defuse-sdk";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useWalletAgnosticSignMessage } from "@/hooks/useWalletAgnosticSignMessage";
import { useOTCOrder } from "@/pages/simple-swap/otc-desk/utils/link";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

const ViewOrderPage = observer(() => {
  const { state, connector } = useConnectWallet();
  const signMessage = useWalletAgnosticSignMessage();
  const multiPayload = useOTCOrder();

  const activeWallet = connector.wallets[0];

  return (
    <>
      <Helmet>
        <title>View OTC Order | NEAR Intents</title>
        <meta
          name="description"
          content="Review and fill an OTC order on NEAR Intents. Peer-to-peer crypto trading across all blockchains."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <OtcTakerWidget
          multiPayload={multiPayload}
          renderHostAppLink={renderAppLink}
          sendNearTransaction={async (tx) => {
            if (!activeWallet) {
              throw new Error("No wallet connected");
            }

            const result = await activeWallet.sendTransaction(tx);

            if (typeof result === "string") {
              return { txHash: result };
            }

            if (result && typeof result === "object" && "transaction" in result) {
              const txResult = result as { transaction?: { hash?: string } };
              return { txHash: txResult.transaction?.hash ?? "" };
            }

            throw new Error("No outcome");
          }}
          signMessage={signMessage}
          tokenList={LIST_TOKENS}
          userAddress={state.isVerified ? state.address : undefined}
          userChainType={toDefuseAuthMethod(state.authMethod)}
        />
      </Paper>
    </>
  );
});

export default ViewOrderPage;
