import { AuthMethod } from "@defuse-protocol/defuse-sdk";
import type { OmniWallet } from "@hot-labs/kit";

type Props = {
  authMethod: AuthMethod;
  wallet?: OmniWallet | null;
  size?: number;
  className?: string;
};

const ICONS: Record<string, string | undefined> = {
  [AuthMethod.Solana]: "/static/icons/wallets/solana.svg",
  [AuthMethod.Near]: "/static/icons/wallets/near.svg",
  evm: "/static/icons/wallets/walletConnect.svg",
  ton: "/static/icons/wallets/ton.svg",
  stellar: "/static/icons/wallets/stellar.svg",
  cosmos: "/static/icons/wallets/cosmos.svg",
};

const WalletIcon = ({ authMethod, wallet, className, size = 36 }: Props) => {
  const getIcon = () => {
    // If wallet has an icon, use it
    if (wallet?.icon) {
      return wallet.icon;
    }
    // Fall back to auth method icon
    return ICONS[authMethod] || null;
  };

  const iconSrc = getIcon();
  if (!iconSrc) return null;

  return <img alt={`${authMethod} Wallet`} className={className} height={size} src={iconSrc} width={size} />;
};

export default WalletIcon;
