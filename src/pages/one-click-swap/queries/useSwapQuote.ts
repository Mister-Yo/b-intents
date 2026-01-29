import { QuoteRequest, type QuoteResponse, type TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { parseUnits } from "viem";
import { oneClickApi } from "@/api/axios";
import { swapExpirySec } from "@/config";
import { mockAddressMap } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import type { OneClickSwapFormValues } from "../types";

type Props = {
  tokenIn: TokenResponse | null;
  tokenOut: TokenResponse | null;
  amountIn: string | null;
  setFormValue: (name: keyof OneClickSwapFormValues, value: string) => void;
  recipient: string | null;
  slippage: string;
  isSubmitting: boolean;
};

const useSwapQuote = ({ tokenIn, tokenOut, amountIn, setFormValue, recipient, slippage, isSubmitting }: Props) => {
  const {
    state: { address },
  } = useConnectWallet();

  const requestBody: QuoteRequest | null =
    tokenIn && tokenOut && amountIn
      ? {
          dry: !recipient,
          swapType: QuoteRequest.swapType.EXACT_INPUT,
          slippageTolerance: Number(slippage) * 100,
          originAsset: tokenIn.assetId,
          depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
          destinationAsset: tokenOut.assetId,
          amount: parseUnits(amountIn, tokenIn.decimals).toString(),
          refundTo: address || mockAddressMap[tokenIn.blockchain],
          refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
          recipient: recipient || mockAddressMap[tokenOut.blockchain],
          recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
          appFees: [{ recipient: "cuziasd.near", fee: 30 }],
          deadline: new Date(Date.now() + swapExpirySec * 1000).toISOString(),
          quoteWaitingTimeMs: 5000,
        }
      : null;

  return useQuery<QuoteResponse | undefined>({
    queryKey: [
      "quote",
      requestBody?.destinationAsset,
      requestBody?.amount,
      requestBody?.recipient,
      requestBody?.originAsset,
      slippage,
    ],
    queryFn: async () => {
      if (!requestBody) return;
      try {
        const { data: response } = await oneClickApi.post<QuoteResponse>("/v0/quote", requestBody);
        setFormValue("amountOut", response.quote.amountOutFormatted);
        if (response.quote.depositAddress) setFormValue("depositAddress", response.quote.depositAddress);
        return response;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data.message || "Invalid request");
        }
        throw error;
      }
    },
    staleTime: 0,
    enabled: !isSubmitting && !!requestBody,
    retry: false,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.quoteRequest?.quoteWaitingTimeMs) {
        return data.quoteRequest.quoteWaitingTimeMs;
      }
      return false;
    },
  });
};

export default useSwapQuote;
