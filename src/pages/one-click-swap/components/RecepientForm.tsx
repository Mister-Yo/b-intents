import { useFormContext } from "react-hook-form";

import MagicPenIcon from "@/components/icons/magic-pen";
import WalletIcon from "@/components/icons/wallet";
import { CHAIN_ICON, CHAIN_TITLE } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import type { OneClickSwapFormValues } from "@/pages/one-click-swap/types";
import { Button } from "@/shadcn/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/shadcn/ui/form";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { toDefuseAuthMethod } from "@/types/wallet";
import { authMethodToBlockchain } from "@/utils";
import { validateAddress } from "@/utils/validateAddress";

const RecipientForm = () => {
  const {
    state: { authMethod, address },
  } = useConnectWallet();

  const { control } = useFormContext<OneClickSwapFormValues>();

  const { tokenOut } = useOneClickSwapStore();
  if (!tokenOut || !address) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-muted-foreground text-sm">Recipient</span>
        <div className="flex items-center gap-2">
          <img
            alt={CHAIN_TITLE[tokenOut.blockchain]}
            className="size-5 rounded-full"
            src={CHAIN_ICON[tokenOut.blockchain]}
          />
          <span className="text-sm text-muted-foreground">{CHAIN_TITLE[tokenOut.blockchain]}</span>
        </div>
      </div>

      <FormField
        control={control}
        disabled={!address}
        name="recipient"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormControl>
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2.5">
                  <WalletIcon className="size-4 text-muted-foreground shrink-0" />
                  <input
                    {...field}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                    data-lpignore="true"
                    className="w-full bg-transparent font-normal text-sm text-foreground outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={field.disabled}
                    placeholder="Enter wallet address"
                    value={field.value ?? ""}
                  />
                </div>
              </FormControl>
              {authMethodToBlockchain(toDefuseAuthMethod(authMethod))?.includes(tokenOut.blockchain) && field.value !== address && (
                <Button
                  className="size-10 shrink-0 rounded-xl"
                  onClick={() => address && field.onChange(address)}
                  size="icon"
                  type="button"
                  variant="secondary"
                >
                  <MagicPenIcon />
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
        rules={{
          required: "This field is required",
          validate: {
            pattern: (value) => {
              const isValidAddress = validateAddress(value, tokenOut.blockchain);
              if (isValidAddress) return;
              return "Invalid address for the selected blockchain";
            },
          },
        }}
      />
    </div>
  );
};

export default RecipientForm;
