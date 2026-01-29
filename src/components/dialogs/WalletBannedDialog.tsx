import { ExclamationTriangleIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { AlertDialog, Button, Callout } from "@radix-ui/themes";
import type { FC } from "react";

const WalletBannedDialog: FC<{ onCancel: () => void }> = ({ onCancel }) => {
  return (
    <AlertDialog.Root open>
      <AlertDialog.Content className="max-w-md animate-slide-up p-6 sm:animate-none">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-amber-50 p-3 dark:bg-amber-950">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <AlertDialog.Title className="font-semibold text-gray-900 text-xl dark:text-gray-100">
            Not Supported Wallet Address
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-gray-600 dark:text-gray-400">
            For your safety, your wallet address can't be used with this app.
          </AlertDialog.Description>
        </div>

        {/* Info List */}
        <div className="mb-5 rounded-lg bg-gray-50 p-4 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-100 p-1 dark:bg-amber-900">
                <MagnifyingGlassIcon className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm">Wallet address was created before EVM support was added to NEAR</span>
            </li>
          </ul>
        </div>

        {/* Warning Message */}
        <Callout.Root className="mb-6 bg-warning px-3 py-2 text-warning-foreground">
          <Callout.Text className="text-xs">Please use a different wallet to continue.</Callout.Text>
        </Callout.Root>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <AlertDialog.Cancel>
            <Button color="gray" onClick={onCancel} size="4" type="button" variant="soft">
              Disconnect
            </Button>
          </AlertDialog.Cancel>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default WalletBannedDialog;
