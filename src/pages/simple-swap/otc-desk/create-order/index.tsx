import { OtcMakerWidget } from "@defuse-protocol/defuse-sdk";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useWalletAgnosticSignMessage } from "@/hooks/useWalletAgnosticSignMessage";
import { createOTCOrderLink } from "@/pages/simple-swap/otc-desk/utils/link";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

const CreateOrderPage = observer(() => {
  const { state, connector } = useConnectWallet();
  const signMessage = useWalletAgnosticSignMessage();

  const activeWallet = connector.wallets[0];

  return (
    <>
      <Helmet>
        <title>Create OTC Order | NEAR Intents</title>
        <meta
          name="description"
          content="Create peer-to-peer OTC orders on NEAR Intents. Trade large amounts of crypto directly with other users across blockchains."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <OtcMakerWidget
          generateLink={(multiPayload) => {
            console.info("multiPayload", multiPayload);
            return createOTCOrderLink(multiPayload);
          }}
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

export default CreateOrderPage;
