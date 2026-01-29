import { AuthMethod } from "@defuse-protocol/defuse-sdk";

export const tokenPairs: Record<AuthMethod, [string, string]> = {
  [AuthMethod.Near]: ["nep141:wrap.near", "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1"],
  [AuthMethod.Solana]: ["nep141:sol.omft.near", "nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near"],
  [AuthMethod.EVM]: ["nep141:eth.omft.near", "nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near"],
  [AuthMethod.WebAuthn]: ["", ""],
};
