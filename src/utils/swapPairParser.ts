import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";

import {
  BLOCKCHAIN_DISPLAY_NAME,
  BLOCKCHAIN_SLUG_MAP,
  BLOCKCHAIN_TO_SLUG,
  NATIVE_TOKEN_SLUGS,
} from "@/constants/seo";

export type ParsedTokenSlug = {
  blockchain: TokenResponse.blockchain | null;
  symbol: string;
};

export type ParsedSwapPair = {
  from: ParsedTokenSlug;
  to: ParsedTokenSlug;
};

/**
 * Parses a single token slug like "eth", "near-usdc", "sol-usdt" into
 * a blockchain + symbol pair.
 *
 * Rules:
 * - "eth" → { blockchain: ETH, symbol: "ETH" } (native token)
 * - "near-usdc" → { blockchain: NEAR, symbol: "USDC" }
 * - "sol-usdt" → { blockchain: SOL, symbol: "USDT" }
 * - "usdc" → { blockchain: null, symbol: "USDC" } (no chain specified)
 */
export function parseTokenSlug(slug: string): ParsedTokenSlug {
  const lower = slug.toLowerCase();

  // Check if it's a native token slug (e.g., "eth", "sol", "btc")
  const nativeMatch = NATIVE_TOKEN_SLUGS[lower];
  if (nativeMatch) {
    return {
      blockchain: nativeMatch.blockchain,
      symbol: nativeMatch.symbol,
    };
  }

  // Check for "blockchain-symbol" format (e.g., "near-usdc", "eth-usdt")
  const dashIndex = lower.indexOf("-");
  if (dashIndex > 0) {
    const prefix = lower.slice(0, dashIndex);
    const suffix = lower.slice(dashIndex + 1);

    const blockchain = BLOCKCHAIN_SLUG_MAP[prefix];
    if (blockchain) {
      return {
        blockchain,
        symbol: suffix.toUpperCase(),
      };
    }
  }

  // Fallback: treat entire slug as a symbol with no specific blockchain
  return {
    blockchain: null,
    symbol: lower.toUpperCase(),
  };
}

/**
 * Parses a swap pair URL parameter like "eth-to-usdc" or "near-usdt-to-sol-usdc"
 * into from/to token definitions.
 *
 * Format: [from-slug]-to-[to-slug]
 * The "-to-" separator splits the pair into two sides.
 */
export function parseSwapPairParam(param: string): ParsedSwapPair | null {
  const lower = param.toLowerCase();

  // Find the "-to-" separator
  const toIndex = lower.indexOf("-to-");
  if (toIndex === -1) return null;

  const fromSlug = lower.slice(0, toIndex);
  const toSlug = lower.slice(toIndex + 4); // skip "-to-"

  if (!fromSlug || !toSlug) return null;

  return {
    from: parseTokenSlug(fromSlug),
    to: parseTokenSlug(toSlug),
  };
}

/**
 * Finds the best matching token from the token list based on parsed slug info.
 */
export function findTokenMatch(
  parsed: ParsedTokenSlug,
  tokens: TokenResponse[],
): TokenResponse | null {
  // If we have both blockchain and symbol, find exact match
  if (parsed.blockchain) {
    const exactMatch = tokens.find(
      (t) =>
        t.blockchain === parsed.blockchain &&
        t.symbol.toUpperCase() === parsed.symbol,
    );
    if (exactMatch) return exactMatch;

    // For native tokens, also check wNEAR → NEAR mapping etc.
    if (parsed.symbol === "NEAR" && parsed.blockchain === "near") {
      const wNear = tokens.find(
        (t) => t.blockchain === "near" && t.assetId === "nep141:wrap.near",
      );
      if (wNear) return wNear;
    }
  }

  // If no blockchain specified, find first token with matching symbol
  const symbolMatch = tokens.find(
    (t) => t.symbol.toUpperCase() === parsed.symbol,
  );
  if (symbolMatch) return symbolMatch;

  return null;
}

/**
 * Generates a swap pair slug from two tokens for URL construction.
 * e.g., tokenIn=ETH on Ethereum, tokenOut=USDC on Solana → "eth-to-sol-usdc"
 */
export function generateSwapPairSlug(
  tokenIn: TokenResponse,
  tokenOut: TokenResponse,
): string {
  const fromSlug = tokenToSlug(tokenIn);
  const toSlug = tokenToSlug(tokenOut);
  return `${fromSlug}-to-${toSlug}`;
}

function tokenToSlug(token: TokenResponse): string {
  const chainSlug = BLOCKCHAIN_TO_SLUG[token.blockchain] ?? token.blockchain;
  const symbol = token.symbol.toLowerCase();

  // Check if this token is the native token of its chain
  const nativeEntry = Object.entries(NATIVE_TOKEN_SLUGS).find(
    ([, v]) =>
      v.blockchain === token.blockchain &&
      v.symbol.toUpperCase() === token.symbol.toUpperCase(),
  );

  if (nativeEntry) {
    return nativeEntry[0]; // e.g., "eth", "sol", "near"
  }

  // Otherwise use "chain-symbol" format
  return `${chainSlug}-${symbol}`;
}

/**
 * Generates SEO-friendly title for a swap pair page.
 */
export function generateSwapTitle(
  fromSymbol: string,
  toSymbol: string,
  fromBlockchain?: TokenResponse.blockchain | null,
  toBlockchain?: TokenResponse.blockchain | null,
): string {
  const fromChain = fromBlockchain ? BLOCKCHAIN_DISPLAY_NAME[fromBlockchain] : "";
  const toChain = toBlockchain ? BLOCKCHAIN_DISPLAY_NAME[toBlockchain] : "";

  const fromLabel =
    fromChain && fromSymbol !== fromChain ? `${fromSymbol} (${fromChain})` : fromSymbol;
  const toLabel =
    toChain && toSymbol !== toChain ? `${toSymbol} (${toChain})` : toSymbol;

  return `Swap ${fromLabel} to ${toLabel} | NEAR Intents`;
}

/**
 * Generates SEO-friendly description for a swap pair page.
 */
export function generateSwapDescription(
  fromSymbol: string,
  toSymbol: string,
  fromBlockchain?: TokenResponse.blockchain | null,
  toBlockchain?: TokenResponse.blockchain | null,
): string {
  const chains = new Set<string>();
  if (fromBlockchain) chains.add(BLOCKCHAIN_DISPLAY_NAME[fromBlockchain]);
  if (toBlockchain) chains.add(BLOCKCHAIN_DISPLAY_NAME[toBlockchain]);

  const isCrossChain = chains.size > 1;
  const chainList = chains.size > 0
    ? ` on ${[...chains].join(" and ")}`
    : "";

  if (isCrossChain) {
    return `Swap ${fromSymbol} to ${toSymbol}${chainList} with no bridge needed. Cross-chain trading powered by NEAR Intents — fast, secure, best rates.`;
  }

  return `Swap ${fromSymbol} to ${toSymbol}${chainList} instantly. Trade with the best rates on NEAR Intents — the universal cross-chain trading protocol.`;
}
