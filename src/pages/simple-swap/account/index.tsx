import { AccountWidget } from "@defuse-protocol/defuse-sdk";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

const AccountPage = () => {
  const { state } = useConnectWallet();

  return (
    <>
      <Helmet>
        <title>Account | NEAR Intents</title>
        <meta
          name="description"
          content="Manage your NEAR Intents account. View balances and transaction history across all connected blockchains."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <AccountWidget
          renderHostAppLink={renderAppLink}
          tokenList={LIST_TOKENS}
          userAddress={(state.isVerified ? state.address : undefined) ?? null}
          userChainType={toDefuseAuthMethod(state.authMethod) ?? null}
        />
      </Paper>
    </>
  );
};

export default AccountPage;
