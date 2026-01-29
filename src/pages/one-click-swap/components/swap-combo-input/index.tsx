import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { Skeleton } from "@radix-ui/themes";
import { Big } from "big.js";
import { TriangleAlert } from "lucide-react";
import { type Control, Controller, type UseControllerProps } from "react-hook-form";
import { formatUnits, parseUnits } from "viem";

import SelectChainDialog from "@/components/dialogs/SelectChainDialog";
import SelectTokenOnlyDialog from "@/components/dialogs/SelectTokenOnlyDialog";
import { cn } from "@/shadcn/utils";
import { formatTokenValue, formatUsdAmount } from "@/utils/format";
import { enforcer } from "@/utils/input";

interface Balance {
  amount: bigint | undefined;
  decimals: number | undefined;
}

interface Props<T extends object> {
  name: UseControllerProps<T>["name"];
  control: Control<T>;
  label: string;
  selectedToken: TokenResponse | null;
  selectToken: (token: TokenResponse) => void;
  selectBlockchain: (blockchain: TokenResponse.blockchain) => void;
  balance: Balance;
  typeToken: "in" | "out";
  usd?: number | null;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  handleEmptyInput?: () => void;
}

const formatBalance = (amount: bigint | undefined, decimals: number | undefined) => {
  if (!amount || !decimals) return 0;
  return formatTokenValue(amount, decimals, {
    min: 0.0001,
    fractionDigits: 4,
  });
};

const formatUsdValue = (value: string, usd?: number | null) => {
  if (!usd || usd <= 0) return null;
  const mul = Big(value || 1)
    .mul(usd)
    .toNumber();
  return `≈${formatUsdAmount(mul)}`;
};

const validateBalance = (value: string, balance: Balance, required: boolean | undefined) => {
  if (!required) return;
  if (!value || !balance.decimals || !balance.amount) return false;
  if (parseUnits(value, balance.decimals) > balance.amount) {
    return "Insufficient balance";
  }
  return;
};

const SwapCompoInput = <T extends object>({
  label,
  control,
  name,
  usd,
  selectedToken,
  selectToken,
  selectBlockchain,
  typeToken,
  balance,
  disabled,
  loading,
  required,
  handleEmptyInput,
}: Props<T>) => {
  const handleMaxClick = (field: { onChange: (value: string) => void }) => {
    if (disabled || !balance.amount || !balance.decimals) return;
    field.onChange(formatUnits(balance.amount, balance.decimals));
  };

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => (
        <div
          className={cn(
            "relative flex flex-col rounded-2xl p-4",
            "bg-[#1a1a1a] border border-white/[0.06]",
            "transition-all duration-200",
            "hover:border-white/[0.1]",
            fieldState.error && "border-red-500/30 bg-red-500/5",
          )}
        >
          {/* Header row: Label + Chain | Balance */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {label && (
                <span className="font-medium text-muted-foreground/60 text-sm">{label}</span>
              )}
              <SelectChainDialog
                typeToken={typeToken}
                selectedBlockchain={selectedToken?.blockchain ?? null}
                onSelectBlockchain={selectBlockchain}
              />
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5",
                !disabled && "cursor-pointer group"
              )}
              onClick={() => handleMaxClick(field)}
            >
              <span className="text-sm text-muted-foreground/50 tabular-nums">
                Balance: {formatBalance(balance.amount, balance.decimals)}
              </span>
              {!disabled && (
                <span className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded",
                  "bg-white/[0.06] text-muted-foreground/70",
                  "group-hover:bg-white/[0.1] group-hover:text-foreground",
                  "transition-all duration-200"
                )}>
                  MAX
                </span>
              )}
            </div>
          </div>

          {/* Main row: Token selector | Input */}
          <div className="flex items-center gap-3">
            <SelectTokenOnlyDialog
              selectedBlockchain={selectedToken?.blockchain ?? null}
              selectedToken={selectedToken}
              onSelectToken={selectToken}
            />
            <div className="flex-1 min-w-0">
              {loading ? (
                <Skeleton className="w-full" height="40px" />
              ) : (
                <input
                  {...field}
                  className={cn(
                    "w-full bg-transparent text-right outline-none",
                    "font-semibold text-2xl tracking-tight text-foreground",
                    "placeholder:text-muted-foreground/30",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  disabled={field.disabled}
                  onChange={(e) => {
                    const enforcedValue = enforcer(e.target.value);
                    if (enforcedValue === null || field.disabled) return;
                    field.onChange(enforcedValue);

                    if (!enforcedValue) handleEmptyInput?.();
                  }}
                  placeholder="0"
                  value={field.value || ""}
                />
              )}
            </div>
          </div>

          {/* Footer row: Error or USD value */}
          <div className="flex items-center justify-end mt-2 min-h-[20px]">
            {fieldState.error?.message ? (
              <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                <TriangleAlert className="size-3.5" />
                {fieldState.error.message}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground/40 tabular-nums">
                {formatUsdValue(field.value, usd)}
              </span>
            )}
          </div>
        </div>
      )}
      rules={{
        required,
        validate: (value) => validateBalance(value, balance, required),
      }}
    />
  );
};

export default SwapCompoInput;
