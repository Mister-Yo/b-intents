import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";

import Paper from "@/components/Paper";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import useSwapPairFromUrl from "@/hooks/useSwapPairFromUrl";
import SwapWidget from "@/pages/one-click-swap/components/swap-widget";
import NotFoundPage from "@/pages/not-found";
import useSwapTokens from "@/pages/one-click-swap/queries/useSwapTokens";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import type { TransferAmountParams } from "@/types/wallet";
import {
  findTokenMatch,
  generateSwapDescription,
  generateSwapTitle,
  parseSwapPairParam,
} from "@/utils/swapPairParser";

const SwapPairPage = observer(() => {
  const { state, transferAmount } = useConnectWallet();
  const { pair } = useParams<{ pair: string }>();
  const { tokens } = useOneClickSwapStore();

  useSwapTokens();
  useSwapPairFromUrl();

  const parsed = pair ? parseSwapPairParam(pair) : null;

  // Invalid URL format (no "-to-" separator)
  if (!parsed) {
    return <NotFoundPage />;
  }

  // Validate pair once tokens are loaded
  const tokensLoaded = tokens.length > 0;
  if (tokensLoaded) {
    const tokenIn = findTokenMatch(parsed.from, tokens);
    const tokenOut = findTokenMatch(parsed.to, tokens);
    if (!tokenIn || !tokenOut) {
      return <NotFoundPage />;
    }
  }

  const title = generateSwapTitle(
    parsed.from.symbol,
    parsed.to.symbol,
    parsed.from.blockchain,
    parsed.to.blockchain,
  );

  const description = generateSwapDescription(
    parsed.from.symbol,
    parsed.to.symbol,
    parsed.from.blockchain,
    parsed.to.blockchain,
  );

  const canonicalUrl = `https://nearintents.io/swap/${pair}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonicalUrl} />
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

export default SwapPairPage;
