export function truncateAddress(address: string | undefined): string {
  if (!address) return "";
  if (address.length <= 16) return address;

  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
