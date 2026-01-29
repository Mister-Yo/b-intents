import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { ChevronRight } from "lucide-react";
import PulseLoader from "@/components/ui/PulseLoader";
import { type Control, Controller, type UseControllerProps } from "react-hook-form";
import { formatUnits, parseUnits } from "viem";

import SelectChainDialog from "@/components/dialogs/SelectChainDialog";
import SelectTokenOnlyDialog from "@/components/dialogs/SelectTokenOnlyDialog";
import { TOKEN_ICON_BY_DEFUSE_ASSET_ID } from "@/constants/tokens";
import type { TokenBalanceMap } from "@/hooks/useTokenBalances";
import { cn } from "@/shadcn/utils";
import { getTokenSymbol } from "@/utils";
import { formatTokenValue, formatUsdAmount } from "@/utils/format";
import { enforcer } from "@/utils/input";

interface Balance {
  amount: bigint | undefined;
  decimals: number | undefined;
}

interface Props<T extends object> {
  type: "from" | "to";
  name: UseControllerProps<T>["name"];
  control: Control<T>;
  selectedToken: TokenResponse | null;
  selectToken: (token: TokenResponse) => void;
  selectBlockchain: (blockchain: TokenResponse.blockchain) => void;
  balance: Balance;
  tokenSymbol?: string;
  usdValue?: number;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  handleEmptyInput?: () => void;
  tokenBalances?: TokenBalanceMap;
  gasReserve?: bigint;
}

const formatBalance = (amount: bigint | undefined, decimals: number | undefined) => {
  if (!amount || !decimals) return "0";
  return formatTokenValue(amount, decimals, {
    min: 0.0001,
    fractionDigits: 4,
  });
};

const validateBalance = (value: string, balance: Balance, required: boolean | undefined) => {
  if (!required) return;
  if (!value || !balance.decimals || !balance.amount) return false;
  if (parseUnits(value, balance.decimals) > balance.amount) {
    return "Insufficient balance";
  }
  return;
};

const SwapInputBlock = <T extends object>({
  type,
  control,
  name,
  selectedToken,
  selectToken,
  selectBlockchain,
  balance,
  tokenSymbol,
  usdValue,
  disabled,
  loading,
  required,
  handleEmptyInput,
  tokenBalances,
  gasReserve,
}: Props<T>) => {
  const isFrom = type === "from";
  const label = isFrom ? "From" : "To";

  const handleMaxClick = (field: { onChange: (value: string) => void }) => {
    if (disabled || !balance.amount || !balance.decimals) return;
    let maxAmount = balance.amount;
    if (gasReserve && maxAmount > gasReserve) {
      maxAmount = maxAmount - gasReserve;
    } else if (gasReserve && maxAmount <= gasReserve) {
      maxAmount = 0n;
    }
    field.onChange(formatUnits(maxAmount, balance.decimals));
  };

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => (
        <div
          className={cn(
            "flex flex-col rounded-2xl",
            "border border-white/[0.08]",
            "transition-all duration-200",
            fieldState.error && "border-red-500/30"
          )}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between border-white/[0.06] border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">{label}</span>
              <SelectChainDialog
                typeToken={type === "from" ? "in" : "out"}
                selectedBlockchain={selectedToken?.blockchain ?? null}
                onSelectBlockchain={selectBlockchain}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="rounded-b-2xl bg-[#141414] p-4">
            {/* Token Row */}
            <div className="flex items-center justify-between">
              <SelectTokenOnlyDialog
                selectedBlockchain={selectedToken?.blockchain ?? null}
                selectedToken={selectedToken}
                onSelectToken={selectToken}
                balances={tokenBalances}
                renderTrigger={
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-3",
                      "transition-opacity hover:opacity-80"
                    )}
                  >
                    {selectedToken ? (
                      <>
                        <img
                          alt={getTokenSymbol(selectedToken)}
                          className="size-9 rounded-full"
                          src={TOKEN_ICON_BY_DEFUSE_ASSET_ID[selectedToken.assetId] ?? "/static/icons/empty.svg"}
                        />
                        <span className="font-semibold text-white text-xl">
                          {getTokenSymbol(selectedToken)}
                        </span>
                        <ChevronRight className="size-4 text-white/40" />
                      </>
                    ) : (
                      <>
                        <div className="size-9 rounded-full bg-[#2a2a2a]" />
                        <span className="font-semibold text-white/60 text-xl">Select</span>
                        <ChevronRight className="size-4 text-white/40" />
                      </>
                    )}
                  </button>
                }
              />

              <div className="ml-4 min-w-0 flex-1">
                {loading ? (
                  <PulseLoader />
                ) : (
                  <input
                    {...field}
                    name={`swap-amount-${type}`}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    inputMode="decimal"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    className={cn(
                      "w-full bg-transparent text-right outline-none",
                      "font-medium text-3xl text-white",
                      "placeholder:text-white/20",
                      "disabled:cursor-not-allowed",
                      "focus:border-none focus:outline-none focus:ring-0",
                      "selection:bg-white/20"
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

            {/* Bottom Row */}
            <div className="mt-3 flex items-center justify-between">
              {isFrom ? (
                <>
                  <div className="flex items-center gap-1.5 text-sm text-white/40">
                    <span>Balance:</span>
                    <span>{formatBalance(balance.amount, balance.decimals)}</span>
                    <span>{tokenSymbol}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMaxClick(field)}
                    className={cn(
                      "rounded-lg px-3 py-1 font-medium text-sm",
                      "border border-white/20 text-white/60",
                      "hover:border-white/40 hover:text-white",
                      "transition-all duration-200"
                    )}
                  >
                    MAX
                  </button>
                </>
              ) : (
                <div className="flex w-full items-center justify-end">
                  <span className="text-sm text-white/40">
                    To receive: {usdValue ? formatUsdAmount(usdValue) : "$0"}
                  </span>
                </div>
              )}
            </div>

            {/* Error */}
            {fieldState.error?.message && (
              <div className="mt-2 text-red-400 text-xs">
                {fieldState.error.message}
              </div>
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

export default SwapInputBlock;
