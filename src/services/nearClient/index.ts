import { FailoverRpcProvider, JsonRpcProvider } from "@near-js/providers";

import { reserveNearRpcUrls, rpcUrls } from "@/config";

/**
 * NEAR RPC providers list from official docs:
 * https://docs.near.org/api/rpc/providers
 */
const reserveRpcUrls = [rpcUrls.near, ...reserveNearRpcUrls];

export const nearClient = new FailoverRpcProvider(reserveRpcUrls.map((url) => new JsonRpcProvider({ url })));
