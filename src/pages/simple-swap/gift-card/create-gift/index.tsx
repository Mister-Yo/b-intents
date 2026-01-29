import { GiftHistoryWidget, GiftMakerWidget } from "@defuse-protocol/defuse-sdk";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useWalletAgnosticSignMessage } from "@/hooks/useWalletAgnosticSignMessage";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

import { createGiftCardLink } from "../utils/link";

const CreateGiftPage = observer(() => {
  const { state, connector } = useConnectWallet();
  const signMessage = useWalletAgnosticSignMessage();

  const activeWallet = connector.wallets[0];

  return (
    <>
      <Helmet>
        <title>Create Crypto Gift Card | NEAR Intents</title>
        <meta
          name="description"
          content="Send crypto as a gift card on NEAR Intents. Create shareable gift links with any token across all blockchains."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <div className="flex flex-col items-center gap-8">
          <GiftMakerWidget
            generateLink={(giftLinkData) => createGiftCardLink(giftLinkData)}
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
          <GiftHistoryWidget
            generateLink={(giftLinkData) => createGiftCardLink(giftLinkData)}
            tokenList={LIST_TOKENS}
            userAddress={state.isVerified ? state.address : undefined}
            userChainType={toDefuseAuthMethod(state.authMethod)}
          />
        </div>
      </Paper>
    </>
  );
});

export default CreateGiftPage;
