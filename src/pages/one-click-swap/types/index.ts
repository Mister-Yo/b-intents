import type { GetExecutionStatusResponse } from "@defuse-protocol/one-click-sdk-typescript";

export type OneClickSwapFormValues = {
  amountIn: string;
  amountOut: string;
  recipient: string;
  depositAddress: string;
};

export type OneClickSwapTransaction = {
  date: string;
  tokenDataIn: { defuseAssetId: string; icon: string; symbol: string; amount: string };
  tokenDataOut: { defuseAssetId: string; icon: string; symbol: string; amount: string };
  status: GetExecutionStatusResponse.status;
};
