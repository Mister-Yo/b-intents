import { AlertDialog } from "@radix-ui/themes";
import type { FC } from "react";

import DefaultContent from "./DefaultContent";
import FailureContent from "./FailureContent";

const WalletVerificationDialog: FC<{
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isVerifying: boolean;
  isFailure: boolean;
}> = ({ open, onConfirm, onCancel, isVerifying, isFailure }) => {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Content className="max-w-md animate-slide-up px-5 pt-5 pb-[max(env(safe-area-inset-bottom,0px),theme(spacing.5))] sm:animate-none">
        {isFailure ? (
          <FailureContent isVerifying={isVerifying} onCancel={onCancel} onConfirm={onConfirm} />
        ) : (
          <DefaultContent isVerifying={isVerifying} onCancel={onCancel} onConfirm={onConfirm} />
        )}
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default WalletVerificationDialog;
