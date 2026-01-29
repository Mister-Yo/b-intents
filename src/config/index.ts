import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";

type Environment = "production" | "stage";

type Config = {
  readonly nearEnv: "mainnet" | "testnet";
  readonly reserveNearRpcUrls: string[];
  readonly walletConnectProjectId: string;
  readonly swapExpirySec: number;
  readonly quoteMinDeadlineMs: number;
  readonly maxQuoteMinDeadlineMs: number;
  readonly rpcUrls: {
    [key in TokenResponse.blockchain]: string;
  } & {
    aurora: string;
    turbochain: string;
  };
  oneClickUrl: string;
};

const production: Config = {
  nearEnv: "mainnet",
  reserveNearRpcUrls: ["https://free.rpc.fastnear.com", "https://rpc.mainnet.near.org"],
  walletConnectProjectId: "b5db73b6bf39bcbf51a5ff3ff5febd85",

  swapExpirySec: 600, // 10 minutes
  /**
   * Minimum deadline for a quote.
   * The server will return quotes with at least this much time remaining.
   */
  quoteMinDeadlineMs: 60_000,
  /**
   * Max value of minimum deadline for a quote.
   * The server will return quotes with at least this much time remaining.
   */
  maxQuoteMinDeadlineMs: 600_000,
  /**
   * RPC URLs for different blockchains.
   * Ensure these URLs are valid and accessible.
   */
  rpcUrls: {
    near: "https://nearrpc.aurora.dev",

    eth: "https://eth.drpc.org",
    base: "https://mainnet.base.org",
    arb: "https://arb1.arbitrum.io/rpc",
    turbochain: "https://rpc-0x4e45415f.aurora-cloud.dev",
    gnosis: "https://rpc.gnosischain.com",
    bera: "https://rpc.berachain.com",
    bsc: "https://binance.llamarpc.com",
    pol: "https://polygon-rpc.com",
    aurora: "https://mainnet.aurora.dev",

    sol: "https://veriee-t2i7nw-fast-mainnet.helius-rpc.com",

    doge: "https://go.getblock.io/5f7f5fba970e4f7a907fcd2c5f4c38a2",
    btc: "https://mainnet.bitcoin.org",
    zec: "https://mainnet.lightwalletd.com",
    xrp: "https://xrplcluster.com",
    ton: "", //TODO

    tron: "",
    sui: "",
    op: "",
    avax: "",
    cardano: "",
    ltc: "",
    xlayer: "",
    monad: "",
    bch: "",
    starknet: "",
    adi: "",
  },
  oneClickUrl: "https://1click.chaindefuser.com",
};

const stage: Config = {
  nearEnv: "testnet",
  reserveNearRpcUrls: [],
  walletConnectProjectId: "b5db73b6bf39bcbf51a5ff3ff5febd85",

  swapExpirySec: 600, // 10 minutes
  /**
   * Minimum deadline for a quote.
   * The server will return quotes with at least this much time remaining.
   */
  quoteMinDeadlineMs: 60_000,
  /**
   * Max value of minimum deadline for a quote.
   * The server will return quotes with at least this much time remaining.
   */
  maxQuoteMinDeadlineMs: 600_000,
  /**
   * RPC URLs for different blockchains.
   * Ensure these URLs are valid and accessible.
   */
  rpcUrls: {
    near: "",
    eth: "",
    base: "",
    arb: "",
    btc: "",
    sol: "",
    doge: "",
    turbochain: "",
    aurora: "",
    xrp: "",
    zec: "",
    gnosis: "",
    bera: "",
    bsc: "",
    pol: "",
    ton: "",
    tron: "",
    sui: "",
    op: "",
    avax: "",
    cardano: "",
    ltc: "",
    xlayer: "",
    monad: "",
    bch: "",
    starknet: "",
    adi: "",
  },
  oneClickUrl: "https://1click.chaindefuser.com",
};

const environments: Record<Environment, Config> = {
  production,
  stage,
};

export const currentEnvironment: Environment = import.meta.env.VITE_ENV_APP || "production";
console.info(currentEnvironment);

export const {
  nearEnv,
  reserveNearRpcUrls,
  walletConnectProjectId,
  swapExpirySec,
  quoteMinDeadlineMs,
  maxQuoteMinDeadlineMs,
  rpcUrls,
  oneClickUrl,
}: Config = environments[currentEnvironment];
