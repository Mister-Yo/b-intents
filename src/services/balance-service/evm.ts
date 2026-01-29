import { type Address, createPublicClient, erc20Abi, http } from "viem";

export const getEvmNativeBalance = async ({
  userAddress,
  rpcUrl,
}: {
  userAddress: Address;
  rpcUrl: string;
}): Promise<bigint | null> => {
  try {
    const client = createPublicClient({
      transport: http(rpcUrl),
    });
    const balance = await client.getBalance({ address: userAddress });
    return BigInt(balance);
  } catch (err: unknown) {
    console.error("Error fetching balances", { cause: err });
    return null;
  }
};

export const getEvmErc20Balance = async ({
  tokenAddress,
  userAddress,
  rpcUrl,
}: {
  tokenAddress: Address;
  userAddress: Address;
  rpcUrl: string;
}): Promise<bigint | null> => {
  try {
    const client = createPublicClient({
      transport: http(rpcUrl),
    });
    const data = await client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [userAddress],
    });
    return BigInt(data);
  } catch (err: unknown) {
    console.error("error fetching evm erc20 balance", { cause: err });
    return null;
  }
};
