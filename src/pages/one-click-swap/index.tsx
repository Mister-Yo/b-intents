import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";

import Paper from "@/components/Paper";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import type { TransferAmountParams } from "@/types/wallet";

import SwapWidget from "./components/swap-widget";
import useSwapTokens from "./queries/useSwapTokens";

const Swap = observer(() => {
  const { state, transferAmount } = useConnectWallet();

  useSwapTokens();

  return (
    <>
      <Helmet>
        <title>Intents - Cross-Chain Swaps on Base</title>
        <meta
          name="description"
          content="Swap, bridge and trade crypto tokens across all blockchains. Base, Ethereum, Solana, Bitcoin, Arbitrum, and more."
        />
        <meta property="og:title" content="Intents - Cross-Chain Swaps on Base" />
        <meta
          property="og:description"
          content="Swap, bridge and trade crypto tokens across all blockchains. Base, Ethereum, Solana, Bitcoin, Arbitrum, and more."
        />
        <meta property="og:url" content="https://b-intents.vercel.app" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://b-intents.vercel.app" />
      </Helmet>
      <Paper>
        <SwapWidget
          transferAmount={async (params: TransferAmountParams) => {
            if (!state.authMethod) return null;
            return transferAmount(params);
          }}
          userAddress={state.address ?? null}
        />
      </Paper>
    </>
  );
});

export default Swap;
