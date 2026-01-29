import type { AuthMethod } from "@defuse-protocol/defuse-sdk";
import type { OmniWallet } from "@hot-labs/kit";
import { CheckIcon, CopyIcon, EnterIcon } from "@radix-ui/react-icons";
import { Separator, Text } from "@radix-ui/themes";
import copy from "copy-to-clipboard";

import WalletIcon from "@/components/WalletIcon";
import { CHAIN_ICON } from "@/constants/tokens";
import { cn } from "@/shadcn/utils";
import type { BlockchainEnum } from "@/types/network";
import { reverseAssetNetworkAdapter } from "@/utils/adapters";
import { truncateAddress } from "@/utils/string";

type WalletConnectionState = {
  chainLabel: BlockchainEnum;
  accountId: string;
  authMethod: AuthMethod;
  wallet?: OmniWallet | null;
};

type WalletConnectionActions = {
  onDisconnect: () => void;
  onCopy: () => void;
  isCopied: boolean;
};

const WalletConnectionsConnector = ({
  accountId,
  chainLabel,
  authMethod,
  wallet,
  onCopy,
  isCopied,
  onDisconnect,
}: WalletConnectionState & WalletConnectionActions) => {
  const blockchain = reverseAssetNetworkAdapter[chainLabel];
  const chainIcon = blockchain ? CHAIN_ICON[blockchain] : null;

  const copyHandler = () => {
    copy(accountId);
    onCopy();
  };

  return (
    <div className="flex flex-col items-center justify-between gap-2.5">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-center gap-4">
          <WalletIcon authMethod={authMethod} className="rounded-full" wallet={wallet} />

          <div className="flex flex-col">
            <Text size="2" weight="medium">
              {truncateAddress(accountId)}
            </Text>
            <Text className="flex items-center gap-1" color="gray" size="2" weight="medium">
              {chainIcon && <img alt={chainLabel} height={12} src={chainIcon} width={12} />}
              {chainLabel}
            </Text>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5">
          <button
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-500 dark:border-white",
              isCopied && "border-green-600 text-green-600",
            )}
            onClick={copyHandler}
            type="button"
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white-200 dark:border dark:border-white"
            onClick={onDisconnect}
            type="button"
          >
            <EnterIcon />
          </button>
        </div>
      </div>

      <Separator orientation="horizontal" size="4" />
    </div>
  );
};

export default WalletConnectionsConnector;
