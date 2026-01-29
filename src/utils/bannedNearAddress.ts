import addresses from "@/gen/bannedNearAddress.json";

const bannedNearAddress = new Set<string>(addresses as string[]);

export const isBannedNearAddress = (address: string): boolean => {
  return bannedNearAddress.has(address.toLowerCase());
};
