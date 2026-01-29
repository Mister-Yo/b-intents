import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram, Transaction as TransactionSolana } from "@solana/web3.js";

import { rpcUrls } from "@/config";
import type { SendTransactionSolanaParams } from "@/types/transactions";

export const createTransferSolanaTransaction = (
  from: string,
  to: string,
  amount: bigint,
): SendTransactionSolanaParams["transactions"] => {
  const transaction = new TransactionSolana().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      lamports: amount,
    }),
  );
  return transaction;
};

export const createSPLTransferSolanaTransaction = (
  from: string,
  to: string,
  amount: bigint,
  token: string,
  ataExists: boolean,
): SendTransactionSolanaParams["transactions"] => {
  const fromPubkey = new PublicKey(from);
  const toPubkey = new PublicKey(to);
  const mintPubkey = new PublicKey(token);

  // Get associated token accounts for sender and receiver
  const fromATA = getAssociatedTokenAddressSync(mintPubkey, fromPubkey);
  const toATA = getAssociatedTokenAddressSync(mintPubkey, toPubkey);

  const transaction = new TransactionSolana();

  if (!ataExists) {
    // Add ATA creation - even if it exists, this will fail gracefully
    transaction.add(createAssociatedTokenAccountInstruction(fromPubkey, toATA, toPubkey, mintPubkey));
  }

  // Add transfer instruction
  transaction.add(createTransferInstruction(fromATA, toATA, fromPubkey, amount));

  return transaction;
};

const checkATAExists = async (connection: Connection, ataAddress: PublicKey): Promise<boolean> => {
  try {
    await getAccount(connection, ataAddress);
    return true;
  } catch {
    return false;
  }
};

export const checkSolanaATARequired = async (
  tokenAddress: string,
  depositAddress: string | null,
  isNativeToken: boolean,
): Promise<boolean> => {
  if (isNativeToken || depositAddress === null) {
    return false;
  }

  const connection = new Connection(rpcUrls.sol);
  const toPubkey = new PublicKey(depositAddress);
  const mintPubkey = new PublicKey(tokenAddress);
  const toATA = getAssociatedTokenAddressSync(mintPubkey, toPubkey);

  const ataExists = await checkATAExists(connection, toATA);
  return !ataExists;
};
