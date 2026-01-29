import { Button, Dialog, Text } from "@radix-ui/themes";

import WalletIcon from "@/components/WalletIcon";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { toDefuseAuthMethod } from "@/types/wallet";
import { truncateAddress } from "@/utils/string";

import WalletConnections from "./WalletConnections";

const AccountDialog = () => {
  const { state, connector } = useConnectWallet();
  const activeWallet = connector.wallets[0] ?? null;
  const defuseAuthMethod = toDefuseAuthMethod(state.authMethod);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          className="!px-1.5 font-bold text-gray-12"
          color="gray"
          radius="full"
          size="2"
          type="button"
          variant="soft"
        >
          <p className="flex items-center gap-2">
            {!!defuseAuthMethod && (
              <WalletIcon authMethod={defuseAuthMethod} className="rounded-full" size={24} wallet={activeWallet} />
            )}
            <Text className="!text-custom-gray" weight="bold">
              {truncateAddress(state.address)}
            </Text>
          </p>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        className="mt-1 max-w-xs rounded-2xl md:mr-[48px] dark:bg-black-800"
        minWidth={{ initial: "300px", xs: "330px" }}
      >
        <div className="flex flex-col gap-5">
          <Dialog.Title className="sr-only" />
          <Dialog.Description className="sr-only" />
          <WalletConnections />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AccountDialog;
