import type { AccountView, CodeResult } from "@near-js/types";
import { base64 } from "@scure/base";

import { nearClient } from "../nearClient";

export const RESERVED_NEAR_BALANCE = 100000000000000000000000n; // 0.1 NEAR reserved for transaction fees and storage

export const getNearNativeBalance = async ({ accountId }: { accountId: string }): Promise<bigint | null> => {
  try {
    const response = await nearClient.query<AccountView>({
      request_type: "view_account",
      finality: "final",
      account_id: accountId,
    });

    const balance = BigInt(response.amount);
    return balance < RESERVED_NEAR_BALANCE ? 0n : balance - RESERVED_NEAR_BALANCE;
  } catch (err: unknown) {
    console.error("error fetching near native balance", { cause: err });
    return null;
  }
};

export const getNearNep141Balance = async ({
  tokenAddress,
  accountId,
}: {
  tokenAddress: string;
  accountId: string;
}): Promise<bigint | null> => {
  try {
    const args = { account_id: accountId };
    const argsBase64 = Buffer.from(JSON.stringify(args)).toString("base64");

    const response = await nearClient.query<CodeResult>({
      request_type: "call_function",
      method_name: "ft_balance_of",
      account_id: tokenAddress,
      args_base64: argsBase64,
      finality: "optimistic",
    });

    const uint8Array = new Uint8Array(response.result);
    const decoder = new TextDecoder();
    const parsed = JSON.parse(decoder.decode(uint8Array));
    const balance = BigInt(parsed);
    return balance;
  } catch (err: unknown) {
    console.error("error fetching near nep141 balance", { cause: err });
    return null;
  }
};

export const getNearNep141StorageBalance = async ({
  contractId,
  accountId,
}: {
  contractId: string;
  accountId: string;
}): Promise<bigint> => {
  try {
    const args = { account_id: accountId };
    const argsBase64 = Buffer.from(JSON.stringify(args)).toString("base64");

    const response = await nearClient.query<CodeResult>({
      request_type: "call_function",
      method_name: "storage_balance_of",
      account_id: contractId,
      args_base64: argsBase64,
      finality: "optimistic",
    });

    const uint8Array = new Uint8Array(response.result);
    const decoder = new TextDecoder();
    const parsed = JSON.parse(decoder.decode(uint8Array));
    return BigInt(parsed?.total || "0");
  } catch (err: unknown) {
    console.error("Error fetching balance", { cause: err });
    return 0n;
  }
};

export const getNearNep141MinStorageBalance = async ({ contractId }: { contractId: string }): Promise<bigint> => {
  const response = await nearClient.query<CodeResult>({
    request_type: "call_function",
    method_name: "storage_balance_bounds",
    account_id: contractId,
    args_base64: base64.encode(new TextEncoder().encode(JSON.stringify({}))),
    finality: "optimistic",
  });

  const uint8Array = new Uint8Array(response.result);
  const decoder = new TextDecoder();
  const parsed = JSON.parse(decoder.decode(uint8Array));
  return BigInt(parsed.min);
};
