import type { BaseTokenInfo, UnifiedTokenInfo } from "@defuse-protocol/defuse-sdk";

const compareTokens = (a: BaseTokenInfo | UnifiedTokenInfo, b: BaseTokenInfo | UnifiedTokenInfo): number => {
  const aTags = (a as { tags?: string[] }).tags || [];
  const bTags = (b as { tags?: string[] }).tags || [];

  const aIsStable = aTags.some((tag) => tag === "type:stablecoin");
  const bIsStable = bTags.some((tag) => tag === "type:stablecoin");

  // Sort stablecoins first
  if (aIsStable && !bIsStable) return -1;
  if (!aIsStable && bIsStable) return 1;

  const aMarketCap = getMarketCapOrder(aTags);
  const bMarketCap = getMarketCapOrder(bTags);

  // Sort by market cap if both have it
  if (aMarketCap !== undefined && bMarketCap !== undefined) {
    return aMarketCap - bMarketCap;
  }

  // Put tokens with market cap before those without
  if (aMarketCap !== undefined) return -1;
  if (bMarketCap !== undefined) return 1;

  return 0;
};

const getMarketCapOrder = (tags: string[]): number | undefined => {
  const mcTag = tags.find((tag) => tag.startsWith("mc:"));
  if (!mcTag) return undefined;
  return Number.parseInt(mcTag.split(":")[1], 10);
};

export const sortTokensByMarketCap = (
  tokens: (BaseTokenInfo | UnifiedTokenInfo)[],
): (BaseTokenInfo | UnifiedTokenInfo)[] => {
  return Array.from(tokens).sort(compareTokens);
};
