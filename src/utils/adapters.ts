import { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";

import { BlockchainEnum } from "@/types/network";

export const assetBlockchainAdapter: Record<TokenResponse.blockchain, BlockchainEnum | undefined> = {
  near: BlockchainEnum.NEAR,

  eth: BlockchainEnum.ETHEREUM,
  base: BlockchainEnum.BASE,
  arb: BlockchainEnum.ARBITRUM,
  // turbochain: undefined,
  gnosis: BlockchainEnum.GNOSIS,
  bera: BlockchainEnum.BERACHAIN,
  bsc: undefined, //TODO BlockchainEnum.BSC,
  pol: undefined, //TODO BlockchainEnum.POL,
  // aurora: BlockchainEnum.AURORA,

  sol: BlockchainEnum.SOLANA,

  doge: BlockchainEnum.DOGECOIN,
  btc: BlockchainEnum.BITCOIN,
  zec: BlockchainEnum.ZCASH,
  xrp: BlockchainEnum.XRPLEDGER,
  ton: undefined, //TODO BlockchainEnum.TON,
  tron: BlockchainEnum.TRON,
  sui: undefined,
  op: undefined,
  avax: undefined,
  cardano: undefined,
  ltc: undefined,
  xlayer: undefined,
  monad: undefined,
  bch: undefined,
  starknet: undefined,
  adi: undefined,
};

export const reverseAssetNetworkAdapter: Record<BlockchainEnum, TokenResponse.blockchain | undefined> = {
  [BlockchainEnum.NEAR]: TokenResponse.blockchain.NEAR,

  [BlockchainEnum.ETHEREUM]: TokenResponse.blockchain.ETH,
  [BlockchainEnum.BASE]: TokenResponse.blockchain.BASE,
  [BlockchainEnum.ARBITRUM]: TokenResponse.blockchain.ARB,
  [BlockchainEnum.GNOSIS]: TokenResponse.blockchain.GNOSIS,
  [BlockchainEnum.BERACHAIN]: TokenResponse.blockchain.BERA,
  // [BlockchainEnum.BSC]: TokenResponse.blockchain.BSC,
  // [BlockchainEnum.POL]: TokenResponse.blockchain.POL,
  [BlockchainEnum.TURBOCHAIN]: undefined, //TODO:TokenResponse.blockchain.TURBOCHAIN,
  [BlockchainEnum.AURORA]: undefined, //TODO:TokenResponse.blockchain.AURORA,

  // [BlockchainEnum.TON]: TokenResponse.blockchain.TON,

  [BlockchainEnum.SOLANA]: TokenResponse.blockchain.SOL,

  [BlockchainEnum.BITCOIN]: TokenResponse.blockchain.BTC,

  [BlockchainEnum.DOGECOIN]: TokenResponse.blockchain.DOGE,

  [BlockchainEnum.XRPLEDGER]: TokenResponse.blockchain.XRP,

  [BlockchainEnum.ZCASH]: TokenResponse.blockchain.ZEC,

  [BlockchainEnum.TRON]: TokenResponse.blockchain.TRON,
  [BlockchainEnum.SUI]: TokenResponse.blockchain.SUI,
  [BlockchainEnum.OP]: TokenResponse.blockchain.OP,
  [BlockchainEnum.AVAX]: TokenResponse.blockchain.AVAX,
  [BlockchainEnum.CARDANO]: TokenResponse.blockchain.CARDANO,
};
