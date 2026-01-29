import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { type Address, createPublicClient, encodeFunctionData, erc20Abi, getAddress, type Hash, http } from "viem";

import { rpcUrls } from "@/config";
import type { SendTransactionEVMParams } from "@/types/transactions";

export const createDepositEVMNativeTransaction = (
  userAddress: string,
  generatedAddress: string,
  amount: bigint,
  chainId: number,
): SendTransactionEVMParams["transactions"] => {
  return {
    account: getAddress(userAddress),
    to: getAddress(generatedAddress),
    value: amount,
    data: "0x",
    chainId,
  };
};

export const createDepositEVMERC20Transaction = (
  userAddress: string,
  assetAccountId: string,
  generatedAddress: string,
  amount: bigint,
  chainId: number,
): SendTransactionEVMParams["transactions"] => {
  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [generatedAddress as Address, amount],
  });
  return {
    account: getAddress(userAddress),
    to: getAddress(assetAccountId),
    data,
    chainId,
  };
};

export const waitEVMTransaction = ({ blockchain, txHash }: { blockchain: TokenResponse.blockchain; txHash: Hash }) => {
  const client = createPublicClient({
    transport: http(rpcUrls[blockchain]),
  });
  return client.waitForTransactionReceipt({ hash: txHash });
};
