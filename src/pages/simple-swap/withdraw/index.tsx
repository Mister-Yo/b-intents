import { WithdrawWidget } from "@defuse-protocol/defuse-sdk";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { LIST_TOKENS } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useWalletAgnosticSignMessage } from "@/hooks/useWalletAgnosticSignMessage";
import { toDefuseAuthMethod } from "@/types/wallet";
import { renderAppLink } from "@/utils/renderHostAppLink";

const Withdraw = observer(() => {
  const { state, connector } = useConnectWallet();
  const signMessage = useWalletAgnosticSignMessage();

  const activeWallet = connector.wallets[0];

  return (
    <>
      <Helmet>
        <title>Withdraw Tokens | NEAR Intents</title>
        <meta
          name="description"
          content="Withdraw tokens from NEAR Intents to Ethereum, Solana, Base, and other blockchains. Secure cross-chain withdrawals."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Paper>
        <WithdrawWidget
          chainType={toDefuseAuthMethod(state.authMethod)}
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
          signMessage={(params) => signMessage(params)}
          tokenList={LIST_TOKENS}
          userAddress={state.isVerified ? state.address : undefined}
        />
      </Paper>
    </>
  );
});

export default Withdraw;
