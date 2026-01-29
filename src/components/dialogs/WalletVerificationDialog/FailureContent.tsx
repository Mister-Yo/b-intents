import { Cross2Icon, ExclamationTriangleIcon, MinusCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { AlertDialog, Callout, Spinner } from "@radix-ui/themes";
import type { FC } from "react";

import { Button } from "@/shadcn/ui/button";

const FailureContent: FC<{
  onConfirm: () => void;
  onCancel: () => void;
  isVerifying: boolean;
}> = ({ onConfirm, onCancel, isVerifying }) => {
  return (
    <>
      {/* Header Section */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-amber-50 p-3 dark:bg-amber-950">
          <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <AlertDialog.Title className="font-semibold text-gray-900 text-xl dark:text-gray-100">
          Unable to Verify
        </AlertDialog.Title>
        <AlertDialog.Description className="mt-2 text-gray-600 dark:text-gray-400">
          The compatibility check couldn't be completed
        </AlertDialog.Description>
      </div>

      {/* Info List */}
      <div className="mb-5 rounded-lg bg-gray-50 p-4 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-100 p-1 dark:bg-amber-900">
              <Cross2Icon className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm">The verification was interrupted or cancelled</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-100 p-1 dark:bg-amber-900">
              <MinusCircledIcon className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm">Some wallets (or devices) are incompatible with the platform</span>
          </li>
        </ul>
      </div>

      {/* Warning Message */}
      <Callout.Root className="mb-6 bg-warning px-3 py-2 text-warning-foreground">
        <Callout.Text className="text-xs">Try again or choose another sign-in option to continue.</Callout.Text>
      </Callout.Root>

      <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
        <AlertDialog.Cancel>
          <Button onClick={onCancel} type="button" variant="destructive">
            Sign out
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button onClick={onConfirm} type="button">
            <Spinner loading={isVerifying}>
              <ReloadIcon />
            </Spinner>
            Try again
          </Button>
        </AlertDialog.Action>
      </div>
    </>
  );
};

export default FailureContent;
