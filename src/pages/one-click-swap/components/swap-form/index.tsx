import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { ArrowDownUp, LogOut } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { parseUnits } from "viem";
import Wallet from "@/components/icons/wallet";
import WalletActionProvider from "@/components/WalletActionProvider";
import { useDebounce } from "@/hooks/react-use/useDebounce";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import useUserBalance from "@/hooks/useUserBalance";
import useSwapQuote from "@/pages/one-click-swap/queries/useSwapQuote";
import type { OneClickSwapFormValues } from "@/pages/one-click-swap/types";
import { Button } from "@/shadcn/ui/button";
import { Form } from "@/shadcn/ui/form";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import type { TransferAmountParams } from "@/types/wallet";
import localStorageService from "@/utils/localStorage";
import { authMethodToBlockchain, getTokenSymbol } from "@/utils";
import { toDefuseAuthMethod } from "@/types/wallet";
import { cn } from "@/shadcn/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import ErrorDisplay from "../ErrorDisplay";
import RecipientForm from "../RecepientForm";
import SwapRateInfo from "../SwapRateInfo";
import SwapInputBlock from "../swap-input-block";

type Props = {
  isSubmitting: boolean;
  onSubmit: (data: OneClickSwapFormValues & TransferAmountParams) => void;
};

const DEFAULT_SLIPPAGE = "1";

const SwapForm: FC<Props> = observer(({ isSubmitting, onSubmit }) => {
  const {
    state: { address, authMethod },
    connect,
    disconnect,
  } = useConnectWallet();
  const form = useFormContext<OneClickSwapFormValues>();
  const [slippage] = useState(() => localStorageService.getItem<string>("slippage") || DEFAULT_SLIPPAGE);
  const { tokenIn, tokenOut, changeToken, changeBlockchain } = useOneClickSwapStore();
  const { balances: tokenBalances } = useTokenBalances();

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    resetField,
    formState: { errors },
  } = form;

  // #8: Auto-fill recipient with connected wallet address when blockchain matches
  // Clear auto-filled address when switching to an incompatible chain
  useEffect(() => {
    if (!address || !tokenOut || !authMethod) return;
    const currentRecipient = getValues("recipient");
    const supportedChains = authMethodToBlockchain(toDefuseAuthMethod(authMethod));
    const walletMatchesChain = supportedChains?.includes(tokenOut.blockchain);

    if (walletMatchesChain && !currentRecipient) {
      setValue("recipient", address);
    } else if (!walletMatchesChain && currentRecipient === address) {
      setValue("recipient", "");
    }
  }, [address, tokenOut, authMethod, setValue, getValues]);
  const amountIn = useWatch({ control: control, name: "amountIn" });
  const recipient = useWatch({ control: control, name: "recipient" });

  const [debouncedAmountIn, setDebouncedValue] = useState<string | null>(null);
  const [debouncedRecipient, setDebouncedRecipient] = useState<string>("");
  useDebounce(() => setDebouncedValue(amountIn), amountIn ? 1000 : 0, [amountIn]);
  useDebounce(() => setDebouncedRecipient(recipient ?? ""), recipient ? 500 : 0, [recipient]);

  const {
    data: swapQuote,
    isError,
    error,
    isLoading,
    isRefetching,
    isFetching,
  } = useSwapQuote({
    isSubmitting,
    slippage,
    tokenIn,
    tokenOut,
    amountIn: errors.amountIn ? null : debouncedAmountIn,
    recipient: errors.recipient ? null : debouncedRecipient,
    setFormValue: (name: keyof OneClickSwapFormValues, value: string) => setValue(name, value),
  });

  const { data: tokenInBalanceData } = useUserBalance(
    tokenIn
      ? {
          address: address ?? null,
          blockchain: tokenIn.blockchain,
          tokenAddress: tokenIn.contractAddress ?? "",
          defuseAssetId: tokenIn.assetId,
        }
      : null,
  );
  // Note: tokenOut balance fetching is disabled as it requires a wallet connected
  // to the destination chain, which may not be available in cross-chain swaps
  const tokenInBalance = { amount: tokenInBalanceData?.balance, decimals: tokenIn?.decimals };
  const tokenOutBalance = { amount: undefined, decimals: tokenOut?.decimals };

  // #10: Reserve 0.1 NEAR for gas when using MAX on native NEAR
  const NEAR_NATIVE_ASSET_ID = "nep141:wrap.near";
  const NEAR_GAS_RESERVE = parseUnits("0.1", 24); // 0.1 NEAR (24 decimals)
  const gasReserve = tokenIn?.assetId === NEAR_NATIVE_ASSET_ID ? NEAR_GAS_RESERVE : undefined;

  const submitHandler = (data: OneClickSwapFormValues) => {
    if (!data.depositAddress) {
      toast.error("Deposit address is not defined");
      return;
    }
    if (!tokenIn) {
      toast.error("Please select a token to swap from");
      return;
    }
    if (!tokenInBalanceData) {
      toast.error("Unable to fetch balance. Please try again.");
      return;
    }
    // #13: Verify connected wallet supports the source token's blockchain
    if (authMethod) {
      const supportedChains = authMethodToBlockchain(toDefuseAuthMethod(authMethod));
      if (!supportedChains?.includes(tokenIn.blockchain)) {
        toast.error(`Connected wallet does not support ${tokenIn.blockchain}. Please connect a compatible wallet.`);
        return;
      }
    }

    const parsedAmount = parseUnits(data.amountIn, tokenIn.decimals);
    const transferAmountParams: TransferAmountParams = {
      depositAddress: data.depositAddress,
      defuseAssetId: tokenIn.assetId,
      tokenAddress: tokenIn.contractAddress ?? "",
      amount: parsedAmount,
      balance: tokenInBalanceData,
      blockchain: tokenIn.blockchain,
    };
    onSubmit({ ...data, ...transferAmountParams });
  };

  const handleSwapDirection = useCallback(() => {
    changeToken({ type: "direction" });
    resetField("amountIn");
    resetField("amountOut");
    resetField("depositAddress");
    setDebouncedValue(null);
  }, [changeToken, resetField]);

  const resetFormFields = useCallback(() => {
    resetField("amountIn");
    resetField("amountOut");
    resetField("depositAddress");
    setDebouncedValue(null);
  }, [resetField]);

  const handleSelectTokenIn = useCallback((token: TokenResponse) => {
    resetFormFields();
    if (token.assetId === tokenOut?.assetId) {
      changeToken({ type: "direction" });
    } else {
      changeToken({ type: "in", token });
    }
  }, [resetFormFields, tokenOut?.assetId, changeToken]);

  const handleSelectBlockchainIn = useCallback((blockchain: TokenResponse.blockchain) => {
    resetFormFields();
    changeBlockchain({ type: "in", blockchain });
  }, [resetFormFields, changeBlockchain]);

  const handleSelectTokenOut = useCallback((token: TokenResponse) => {
    if (token.assetId === tokenIn?.assetId) {
      changeToken({ type: "direction" });
    } else {
      changeToken({ type: "out", token });
    }
  }, [tokenIn?.assetId, changeToken]);

  const handleSelectBlockchainOut = useCallback((blockchain: TokenResponse.blockchain) => {
    changeBlockchain({ type: "out", blockchain });
  }, [changeBlockchain]);

  const handleEmptyInput = useCallback(() => {
    resetField("amountOut");
  }, [resetField]);

  const isQuoteLoading = useMemo(
    () => isLoading || isRefetching || isFetching,
    [isLoading, isRefetching, isFetching]
  );

  return (
    <Form {...form}>
      <form
        className={cn(
          "flex flex-col rounded-[20px] p-5",
          "border border-white/[0.08] bg-[#1a1a1a]"
        )}
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <a href="/" className="group cursor-pointer select-none">
            <img src="/nearintents.svg" alt="near Intents" className="ml-[5px] h-[30px] transition-opacity duration-200 group-hover:opacity-80" />
          </a>
          {address ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-4 py-2 font-medium text-sm text-white outline-none transition-all hover:text-white/80 focus:outline-none"
                >
                  <Wallet className="size-4" />
                  <span className="max-w-[100px] truncate">{address}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-0 bg-[#2a2a2a]"
              >
                <DropdownMenuItem
                  onClick={disconnect}
                  className="cursor-pointer text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              onClick={connect}
              className="flex items-center gap-2 rounded-full bg-[#F05A28] px-4 py-2 font-medium text-sm text-white transition-all hover:bg-[#ff7a00]"
            >
              <Wallet className="size-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>

        {/* From Block */}
        <div className="relative flex flex-col">
          <SwapInputBlock
            type="from"
            balance={tokenInBalance}
            control={control}
            handleEmptyInput={handleEmptyInput}
            name="amountIn"
            required
            selectedToken={tokenIn}
            selectToken={handleSelectTokenIn}
            selectBlockchain={handleSelectBlockchainIn}
            tokenSymbol={getTokenSymbol(tokenIn)}
            tokenBalances={tokenBalances}
            gasReserve={gasReserve}
          />

          {/* Swap Direction Button */}
          <div className="relative z-10 -my-3 flex justify-center">
            <button
              className={cn(
                "flex items-center justify-center",
                "size-10 rounded-full",
                "border-4 border-[#1a1a1a] bg-[#2a2a2a]",
                "text-white/70 transition-all duration-200",
                "hover:bg-[#3a3a3a] hover:text-white",
                "active:scale-95"
              )}
              onClick={handleSwapDirection}
              type="button"
            >
              <ArrowDownUp className="size-4" />
            </button>
          </div>

          {/* To Block */}
          <SwapInputBlock
            type="to"
            balance={tokenOutBalance}
            control={control}
            disabled
            loading={isQuoteLoading}
            name="amountOut"
            selectedToken={tokenOut}
            selectToken={handleSelectTokenOut}
            selectBlockchain={handleSelectBlockchainOut}
            tokenSymbol={getTokenSymbol(tokenOut)}
            usdValue={swapQuote?.quote?.amountOutUsd
              ? Number(swapQuote.quote.amountOutUsd)
              : undefined
            }
            tokenBalances={tokenBalances}
          />
        </div>

        <div className="mt-4">
          <RecipientForm />
        </div>

        {swapQuote && <SwapRateInfo swapQuote={swapQuote} />}

        {isError && debouncedRecipient && (
          <div className="mt-4">
            <ErrorDisplay message={error.message} />
          </div>
        )}

        {/* Confirm Button */}
        <WalletActionProvider>
          {(() => {
            const hasRecipient = Boolean(recipient && recipient.trim());
            const recipientSynced = hasRecipient && recipient === debouncedRecipient;
            const isReady = !isSubmitting && !isError && swapQuote && recipientSynced && !isQuoteLoading;
            return (
              <Button
                className={cn(
                  "mt-8 h-14 rounded-2xl font-semibold text-base",
                  isReady
                    ? "bg-[#F05A28] text-white hover:bg-[#ff7a00]"
                    : "bg-[#3a3a3a] text-white/60 hover:bg-[#4a4a4a]",
                  "disabled:bg-[#2a2a2a] disabled:text-white/30"
                )}
                disabled={!isReady}
                loading={isQuoteLoading || (hasRecipient && !recipientSynced)}
                type="submit"
              >
                Confirm
              </Button>
            );
          })()}
        </WalletActionProvider>
      </form>
    </Form>
  );
});

export default SwapForm;
