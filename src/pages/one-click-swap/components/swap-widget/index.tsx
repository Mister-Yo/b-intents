import { useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { OneClickSwapFormValues } from "@/pages/one-click-swap/types";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { useSwapHistoryStore } from "@/stores/useSwapHistoryStore";
import type { TransferAmountParams } from "@/types/wallet";
import { useHotConnector } from "@/providers/hot-connector-provider";
import { assert } from "@/utils/assert";
import useSwapSubmit from "../../queries/useSwapSubmit";
// import { HistoryPanel } from "../history";
import { SwapHistoryPanel } from "../pending-swaps";
import SwapForm from "../swap-form";
import TokensUpdater from "../TokensUpdater";

type Props = {
  userAddress: string | null;
  transferAmount: (amount: TransferAmountParams) => Promise<string | null>;
};

const SwapWidget: FC<Props> = ({ userAddress, transferAmount }) => {
  const queryClient = useQueryClient();
  const connector = useHotConnector();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<OneClickSwapFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      amountIn: "",
      amountOut: "",
    },
  });

  const { tokenIn, tokenOut } = useOneClickSwapStore();
  const { addSwap } = useSwapHistoryStore();

  const { mutateAsync: submitSwapAsync, isPending } = useSwapSubmit();

  const onSubmit = async (data: OneClickSwapFormValues & TransferAmountParams) => {
    try {
      setIsSubmitting(true);
      const transferHash = await transferAmount(data);
      assert(transferHash !== null, "Transfer hash is not define");

      await submitSwapAsync({ txHash: transferHash, depositAddress: data.recipient });
      if (userAddress && tokenIn && tokenOut) {
        addSwap({
          depositAddress: data.depositAddress,
          userAddress,
          tokenInAssetId: tokenIn.assetId,
          tokenOutAssetId: tokenOut.assetId,
          amountIn: data.amountIn,
          amountOut: data.amountOut,
        });
      }
      methods.reset();

      // #14: Refetch balances after swap with delay to allow blockchain to update
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["balance"],
          predicate: (query) => {
            const key = query.queryKey;
            return key[0] === "balance" &&
              typeof key[1] === "object" &&
              key[1] !== null &&
              (key[1] as { address?: string }).address === userAddress;
          },
        });
        // Also refetch HotConnector token balances for the selector modal
        const activeWallet = connector.wallets[0];
        if (activeWallet) {
          connector.fetchTokens(activeWallet).catch(console.error);
        }
      }, 3000);
    } catch (error) {
      console.error("Error while transfer and submit action\n\n", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when user address changes (e.g., wallet disconnect)
  useEffect(() => {
    methods.reset();
  }, [userAddress]);

  return (
    <div>
      <TokensUpdater />
      <FormProvider {...methods}>
        <SwapForm isSubmitting={isSubmitting || isPending} onSubmit={onSubmit} />
      </FormProvider>

      <SwapHistoryPanel userAddress={userAddress} />

      {/* <HistoryPanel accountId={userAddress} /> */}
    </div>
  );
};

export default SwapWidget;
