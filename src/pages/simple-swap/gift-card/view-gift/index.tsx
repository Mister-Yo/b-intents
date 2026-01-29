import { GiftTakerWidget } from "@defuse-protocol/defuse-sdk";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

import { useGiftCard } from "../utils/link";

const ViewGiftPage = () => {
  const { state } = useConnectWallet();
  const secretKey = useGiftCard();

  return (
    <>
      <Helmet>
        <title>Claim Crypto Gift Card | NEAR Intents</title>
        <meta
          name="description"
          content="Claim your crypto gift card on NEAR Intents. Redeem tokens sent to you across any blockchain."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <GiftTakerWidget
          renderHostAppLink={renderAppLink}
          secretKey={secretKey}
          tokenList={LIST_TOKENS}
          userAddress={state.isVerified ? state.address : undefined}
          userChainType={toDefuseAuthMethod(state.authMethod)}
        />
      </Paper>
    </>
  );
};

export default ViewGiftPage;
