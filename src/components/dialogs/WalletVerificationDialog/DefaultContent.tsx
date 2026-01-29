import { CheckIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { AlertDialog, Callout, Spinner } from "@radix-ui/themes";
import type { FC } from "react";

import { Button } from "@/shadcn/ui/button";

const DefaultContent: FC<{ onConfirm: () => void; onCancel: () => void; isVerifying: boolean }> = ({
  onConfirm,
  onCancel,
  isVerifying,
}) => {
  return (
    <>
      {/* Header Section */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-blue-50 p-3 dark:bg-blue-950">
          <LockClosedIcon className="h-6 w-6 text-blue-600 darkL:text-blue-400" />
        </div>
        <AlertDialog.Title className="font-semibold text-gray-900 text-xl dark:text-gray-100">
          Signature Check Required
        </AlertDialog.Title>
        <AlertDialog.Description className="mt-2 text-gray-600 dark:text-gray-400">
          Please verify your device compatibility with the platform
        </AlertDialog.Description>
      </div>

      {/* Features List */}
      <div className="mb-5 rounded-lg bg-gray-50 p-4 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <CheckIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm">Safe transactions and transfers</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <CheckIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm">Full access to all platform features</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
              <CheckIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm">Protection of your funds</span>
          </li>
        </ul>
      </div>

      {/* Warning Message */}
      <Callout.Root className="mb-6 bg-warning px-3 py-2 text-warning-foreground">
        <Callout.Text className="text-xs">
          Canceling this check will sign you out. You can sign in and verify anytime.
        </Callout.Text>
      </Callout.Root>

      <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
        <AlertDialog.Cancel>
          <Button color="gray" onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button onClick={onConfirm} type="button">
            <Spinner loading={isVerifying} />
            {isVerifying ? "Checking..." : "Check Compatibility"}
          </Button>
        </AlertDialog.Action>
      </div>
    </>
  );
};

export default DefaultContent;
