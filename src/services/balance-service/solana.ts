import { AccountLayout } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

import { rpcUrls } from "@/config";

export const getSolanaNativeBalance = async ({
  userAddress,
  rpcUrl = rpcUrls.sol,
}: {
  userAddress: string;
  rpcUrl?: string;
}): Promise<bigint | null> => {
  try {
    const connection = new Connection(rpcUrl, "confirmed");
    const publicKey = new PublicKey(userAddress);
    const balance = await connection.getBalance(publicKey);
    return BigInt(balance);
  } catch (err: unknown) {
    console.error("error fetching Solana native balance", { cause: err });
    return null;
  }
};

export const getSolanaSplBalance = async ({
  userAddress,
  tokenAddress,
  rpcUrl = rpcUrls.sol,
}: {
  userAddress: string;
  tokenAddress: string;
  rpcUrl?: string;
}): Promise<bigint | null> => {
  try {
    const connection = new Connection(rpcUrl, "confirmed");
    const publicKey = new PublicKey(userAddress);
    const tokenPublicKey = new PublicKey(tokenAddress);

    const accounts = await connection.getTokenAccountsByOwner(publicKey, {
      mint: tokenPublicKey,
    });

    // Sum up all token accounts' balances (usually there's just one)
    const balance = accounts.value.reduce((total, accountInfo) => {
      const decoded = AccountLayout.decode(accountInfo.account.data);
      return total + BigInt(decoded.amount.toString());
    }, 0n);

    return balance;
  } catch (err: unknown) {
    console.error("error fetching Solana SPL token balance", { cause: err });
    return null;
  }
};
