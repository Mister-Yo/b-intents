import { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";

/**
 * Maps URL-friendly blockchain slugs to TokenResponse.blockchain enum values.
 * Used for parsing URLs like /swap/eth-usdc-to-sol-usdc
 */
export const BLOCKCHAIN_SLUG_MAP: Record<string, TokenResponse.blockchain> = {
  near: TokenResponse.blockchain.NEAR,
  eth: TokenResponse.blockchain.ETH,
  ethereum: TokenResponse.blockchain.ETH,
  base: TokenResponse.blockchain.BASE,
  arb: TokenResponse.blockchain.ARB,
  arbitrum: TokenResponse.blockchain.ARB,
  sol: TokenResponse.blockchain.SOL,
  solana: TokenResponse.blockchain.SOL,
  btc: TokenResponse.blockchain.BTC,
  bitcoin: TokenResponse.blockchain.BTC,
  ton: TokenResponse.blockchain.TON,
  doge: TokenResponse.blockchain.DOGE,
  dogecoin: TokenResponse.blockchain.DOGE,
  xrp: TokenResponse.blockchain.XRP,
  zec: TokenResponse.blockchain.ZEC,
  zcash: TokenResponse.blockchain.ZEC,
  gnosis: TokenResponse.blockchain.GNOSIS,
  bera: TokenResponse.blockchain.BERA,
  berachain: TokenResponse.blockchain.BERA,
  bsc: TokenResponse.blockchain.BSC,
  bnb: TokenResponse.blockchain.BSC,
  pol: TokenResponse.blockchain.POL,
  polygon: TokenResponse.blockchain.POL,
  tron: TokenResponse.blockchain.TRON,
  sui: TokenResponse.blockchain.SUI,
  op: TokenResponse.blockchain.OP,
  optimism: TokenResponse.blockchain.OP,
  avax: TokenResponse.blockchain.AVAX,
  avalanche: TokenResponse.blockchain.AVAX,
  cardano: TokenResponse.blockchain.CARDANO,
  ada: TokenResponse.blockchain.CARDANO,
  ltc: TokenResponse.blockchain.LTC,
  litecoin: TokenResponse.blockchain.LTC,
  bch: TokenResponse.blockchain.BCH,
  starknet: TokenResponse.blockchain.STARKNET,
};

/**
 * Reverse map: blockchain enum → preferred short slug for URLs
 */
export const BLOCKCHAIN_TO_SLUG: Record<TokenResponse.blockchain, string> = {
  [TokenResponse.blockchain.NEAR]: "near",
  [TokenResponse.blockchain.ETH]: "eth",
  [TokenResponse.blockchain.BASE]: "base",
  [TokenResponse.blockchain.ARB]: "arb",
  [TokenResponse.blockchain.SOL]: "sol",
  [TokenResponse.blockchain.BTC]: "btc",
  [TokenResponse.blockchain.TON]: "ton",
  [TokenResponse.blockchain.DOGE]: "doge",
  [TokenResponse.blockchain.XRP]: "xrp",
  [TokenResponse.blockchain.ZEC]: "zec",
  [TokenResponse.blockchain.GNOSIS]: "gnosis",
  [TokenResponse.blockchain.BERA]: "bera",
  [TokenResponse.blockchain.BSC]: "bsc",
  [TokenResponse.blockchain.POL]: "pol",
  [TokenResponse.blockchain.TRON]: "tron",
  [TokenResponse.blockchain.SUI]: "sui",
  [TokenResponse.blockchain.OP]: "op",
  [TokenResponse.blockchain.AVAX]: "avax",
  [TokenResponse.blockchain.CARDANO]: "cardano",
  [TokenResponse.blockchain.LTC]: "ltc",
  [TokenResponse.blockchain.XLAYER]: "xlayer",
  [TokenResponse.blockchain.MONAD]: "monad",
  [TokenResponse.blockchain.BCH]: "bch",
  [TokenResponse.blockchain.STARKNET]: "starknet",
  [TokenResponse.blockchain.ADI]: "sonic",
};

/**
 * Native token symbols that don't need a blockchain prefix in the URL.
 * e.g., "eth" means ETH on Ethereum, "sol" means SOL on Solana
 */
export const NATIVE_TOKEN_SLUGS: Record<string, { blockchain: TokenResponse.blockchain; symbol: string }> = {
  eth: { blockchain: TokenResponse.blockchain.ETH, symbol: "ETH" },
  near: { blockchain: TokenResponse.blockchain.NEAR, symbol: "NEAR" },
  sol: { blockchain: TokenResponse.blockchain.SOL, symbol: "SOL" },
  btc: { blockchain: TokenResponse.blockchain.BTC, symbol: "BTC" },
  bnb: { blockchain: TokenResponse.blockchain.BSC, symbol: "BNB" },
  matic: { blockchain: TokenResponse.blockchain.POL, symbol: "POL" },
  pol: { blockchain: TokenResponse.blockchain.POL, symbol: "POL" },
  doge: { blockchain: TokenResponse.blockchain.DOGE, symbol: "DOGE" },
  xrp: { blockchain: TokenResponse.blockchain.XRP, symbol: "XRP" },
  ton: { blockchain: TokenResponse.blockchain.TON, symbol: "TON" },
  avax: { blockchain: TokenResponse.blockchain.AVAX, symbol: "AVAX" },
  ltc: { blockchain: TokenResponse.blockchain.LTC, symbol: "LTC" },
  ada: { blockchain: TokenResponse.blockchain.CARDANO, symbol: "ADA" },
  sui: { blockchain: TokenResponse.blockchain.SUI, symbol: "SUI" },
  trx: { blockchain: TokenResponse.blockchain.TRON, symbol: "TRX" },
  bch: { blockchain: TokenResponse.blockchain.BCH, symbol: "BCH" },
  zec: { blockchain: TokenResponse.blockchain.ZEC, symbol: "ZEC" },
};

/**
 * Human-readable blockchain names for SEO meta tags
 */
export const BLOCKCHAIN_DISPLAY_NAME: Record<TokenResponse.blockchain, string> = {
  [TokenResponse.blockchain.NEAR]: "NEAR",
  [TokenResponse.blockchain.ETH]: "Ethereum",
  [TokenResponse.blockchain.BASE]: "Base",
  [TokenResponse.blockchain.ARB]: "Arbitrum",
  [TokenResponse.blockchain.SOL]: "Solana",
  [TokenResponse.blockchain.BTC]: "Bitcoin",
  [TokenResponse.blockchain.TON]: "TON",
  [TokenResponse.blockchain.DOGE]: "Dogecoin",
  [TokenResponse.blockchain.XRP]: "XRP Ledger",
  [TokenResponse.blockchain.ZEC]: "Zcash",
  [TokenResponse.blockchain.GNOSIS]: "Gnosis",
  [TokenResponse.blockchain.BERA]: "Berachain",
  [TokenResponse.blockchain.BSC]: "BNB Chain",
  [TokenResponse.blockchain.POL]: "Polygon",
  [TokenResponse.blockchain.TRON]: "Tron",
  [TokenResponse.blockchain.SUI]: "Sui",
  [TokenResponse.blockchain.OP]: "Optimism",
  [TokenResponse.blockchain.AVAX]: "Avalanche",
  [TokenResponse.blockchain.CARDANO]: "Cardano",
  [TokenResponse.blockchain.LTC]: "Litecoin",
  [TokenResponse.blockchain.XLAYER]: "X Layer",
  [TokenResponse.blockchain.MONAD]: "Monad",
  [TokenResponse.blockchain.BCH]: "Bitcoin Cash",
  [TokenResponse.blockchain.STARKNET]: "Starknet",
  [TokenResponse.blockchain.ADI]: "Sonic",
};

export type SwapPairSlug = {
  from: string;
  to: string;
};

/**
 * Popular swap pairs for sitemap generation.
 * Format: "from-to" where each side is [blockchain-]symbol (lowercase).
 */
export const POPULAR_SWAP_PAIRS: SwapPairSlug[] = [
  // Major native-to-native swaps
  { from: "eth", to: "near" },
  { from: "near", to: "eth" },
  { from: "eth", to: "sol" },
  { from: "sol", to: "eth" },
  { from: "eth", to: "btc" },
  { from: "btc", to: "eth" },
  { from: "near", to: "sol" },
  { from: "sol", to: "near" },
  { from: "near", to: "btc" },
  { from: "btc", to: "near" },
  { from: "sol", to: "btc" },
  { from: "btc", to: "sol" },

  // USDC cross-chain
  { from: "eth-usdc", to: "sol-usdc" },
  { from: "sol-usdc", to: "eth-usdc" },
  { from: "eth-usdc", to: "near-usdc" },
  { from: "near-usdc", to: "eth-usdc" },
  { from: "eth-usdc", to: "base-usdc" },
  { from: "base-usdc", to: "eth-usdc" },
  { from: "eth-usdc", to: "arb-usdc" },
  { from: "arb-usdc", to: "eth-usdc" },
  { from: "sol-usdc", to: "near-usdc" },

  // USDT cross-chain
  { from: "eth-usdt", to: "sol-usdt" },
  { from: "near-usdt", to: "sol-usdc" },
  { from: "near-usdt", to: "eth-usdc" },
  { from: "eth-usdt", to: "near-usdt" },

  // Native to stablecoins
  { from: "eth", to: "eth-usdc" },
  { from: "eth", to: "eth-usdt" },
  { from: "near", to: "near-usdc" },
  { from: "near", to: "near-usdt" },
  { from: "sol", to: "sol-usdc" },
  { from: "sol", to: "sol-usdt" },
  { from: "btc", to: "eth-usdc" },
  { from: "btc", to: "sol-usdc" },

  // Stablecoins to native
  { from: "eth-usdc", to: "eth" },
  { from: "eth-usdc", to: "near" },
  { from: "eth-usdc", to: "sol" },
  { from: "eth-usdc", to: "btc" },
  { from: "sol-usdc", to: "sol" },
  { from: "sol-usdc", to: "near" },

  // Cross-chain native to stablecoins
  { from: "eth", to: "sol-usdc" },
  { from: "eth", to: "near-usdc" },
  { from: "sol", to: "eth-usdc" },
  { from: "near", to: "eth-usdc" },
  { from: "near", to: "sol-usdc" },

  // BNB / Polygon pairs
  { from: "bnb", to: "eth" },
  { from: "eth", to: "bnb" },
  { from: "bnb", to: "eth-usdc" },
  { from: "pol", to: "eth" },
  { from: "eth", to: "pol" },

  // Alt chains
  { from: "doge", to: "eth" },
  { from: "doge", to: "sol" },
  { from: "xrp", to: "eth" },
  { from: "xrp", to: "sol" },
  { from: "ton", to: "eth" },
  { from: "ton", to: "sol" },
  { from: "avax", to: "eth" },
  { from: "ltc", to: "eth" },
  { from: "ltc", to: "btc" },
  { from: "sui", to: "eth" },
  { from: "sui", to: "sol" },
];
