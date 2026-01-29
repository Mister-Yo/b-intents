import { Dialog, Text } from "@radix-ui/themes";
import type { FC } from "react";

import Wallet from "@/components/icons/wallet";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { Button } from "@/shadcn/ui/button";
import { cn } from "@/shadcn/utils";
import { useSignInWindowOpenState } from "@/stores/useSignInWindowOpenState";

type Props = {
  isHeader?: boolean;
};

const WalletListDialog: FC<Props> = ({ isHeader = false }) => {
  const { isOpen, setIsOpen } = useSignInWindowOpenState();
  const { connect } = useConnectWallet();

  const handleConnect = () => {
    setIsOpen(false);
    connect(); // Opens HotConnector's built-in wallet selector
  };

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger>
        <Button
          className={cn(isHeader && "bg-[var(--ruby-9)]")}
          type="button"
          variant={isHeader ? "default" : "outline"}
        >
          <Wallet />
          <Text weight="bold" wrap="nowrap">
            Connect Wallet
          </Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        className="rounded-2xl md:mr-[48px] dark:bg-black-800"
        maxWidth={{ initial: "90vw", xs: "480px" }}
        minWidth={{ initial: "300px", xs: "330px" }}
      >
        <Dialog.Title className="sr-only" />
        <Dialog.Description className="sr-only" />
        <Text className="font-bold text-xl">Connect your wallet</Text>
        <div className="mt-4 grid w-full grid-cols-1 gap-4">
          <Text className="font-semibold text-base" color="gray">
            Select a wallet to connect
          </Text>
          <Button className="px-2.5 py-4" onClick={handleConnect} size="nosize" variant="secondary">
            <div className="flex w-full items-center justify-center gap-2">
              <Wallet />
              <Text size="3" weight="bold">
                Connect Wallet
              </Text>
            </div>
          </Button>
          <Text className="text-center text-gray-500 text-sm">
            Supports NEAR, Solana, EVM, TON, Stellar, and more
          </Text>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WalletListDialog;
