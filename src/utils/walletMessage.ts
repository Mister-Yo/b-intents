import { type AuthMethod, createEmptyIntentMessage, formatSignedIntent } from "@defuse-protocol/defuse-sdk";
import { config } from "@defuse-protocol/defuse-sdk/config";
import { JsonRpcProvider } from "@near-js/providers";
import type { CodeResult } from "@near-js/types";

import { rpcUrls } from "@/config";
import { hasMessage } from "@/utils/errors";

export async function verifyWalletSignature(
  signature: Parameters<typeof formatSignedIntent>[0],
  credential: string,
  credentialType: AuthMethod,
): Promise<boolean> {
  if (
    /**
     * NEP-413 signatures can't be verified onchain for explicit account IDs (e.g., foo.near)
     * until the user sends a one-time transaction to register their public key with the account.
     * So we fall back to local verification.
     */
    signature.type === "NEP413"
  ) {
    return signature.signatureData.accountId === credential;
  }

  const signedIntent = formatSignedIntent(signature, {
    credential,
    credentialType,
  });

  // const jsonProviders = NEAR_RPS.map((url) => new JsonRpcProvider({ url }));
  // const rpc = new FailoverRpcProvider(jsonProviders);
  const rpc = new JsonRpcProvider({ url: rpcUrls.near });

  try {
    await rpc.query<CodeResult>({
      request_type: "call_function",
      account_id: config.env.contractID,
      method_name: "simulate_intents",
      args_base64: btoa(JSON.stringify({ signed: [signedIntent] })),
      finality: "optimistic",
    });

    // If didn't throw, signature is valid
    return true;
  } catch (err) {
    if (hasMessage(err, "invalid signature")) {
      return false;
    }
    throw err;
  }
}

export const walletVerificationMessageFactory = (credential: string, credentialType: AuthMethod) => {
  return createEmptyIntentMessage({
    signerId: { credential, credentialType },
  });
};
