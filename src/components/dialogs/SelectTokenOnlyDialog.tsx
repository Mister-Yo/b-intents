import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { Dialog } from "@radix-ui/themes";
import { ChevronRight, SearchIcon, X } from "lucide-react";
import { type FC, type ReactNode, useMemo, useState } from "react";

import { CHAIN_ICON, TOKEN_ICON_BY_DEFUSE_ASSET_ID } from "@/constants/tokens";
import type { TokenBalanceMap } from "@/hooks/useTokenBalances";
import { cn } from "@/shadcn/utils";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { getTokenSymbol } from "@/utils";
import { formatTokenValue } from "@/utils/format";

type Props = {
  selectedBlockchain: TokenResponse.blockchain | null;
  selectedToken: TokenResponse | null;
  onSelectToken: (token: TokenResponse) => void;
  renderTrigger?: ReactNode;
  balances?: TokenBalanceMap;
};

const SelectTokenOnlyDialog: FC<Props> = ({ selectedBlockchain, selectedToken, onSelectToken, renderTrigger, balances }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { tokens } = useOneClickSwapStore();

  const filteredTokens = useMemo(() => {
    const lowerSearch = search?.toLowerCase();
    const filtered = tokens.filter(({ symbol, blockchain }) => {
      const matchesSearch = lowerSearch ? symbol.toLowerCase().includes(lowerSearch) : true;
      const matchesNetwork = selectedBlockchain ? blockchain === selectedBlockchain : true;
      return matchesSearch && matchesNetwork;
    });

    // Sort: tokens with balance first (descending by USD value), then the rest
    if (balances) {
      filtered.sort((a, b) => {
        const balA = balances[a.assetId];
        const balB = balances[b.assetId];
        const hasA = balA && balA.balance > 0n;
        const hasB = balB && balB.balance > 0n;

        if (hasA && !hasB) return -1;
        if (!hasA && hasB) return 1;
        if (hasA && hasB) {
          // Sort by USD value descending
          const usdA = a.price ? Number(formatTokenValue(balA.balance, balA.decimals, { fractionDigits: 6 })) * a.price : 0;
          const usdB = b.price ? Number(formatTokenValue(balB.balance, balB.decimals, { fractionDigits: 6 })) * b.price : 0;
          return usdB - usdA;
        }
        return 0;
      });
    }

    return filtered;
  }, [tokens, search, selectedBlockchain, balances]);

  const defaultTrigger = (
    <button
      className={cn(
        "group flex items-center gap-2 py-1.5 pr-3 pl-2",
        "rounded-full transition-all duration-200",
        "bg-[#252525] hover:bg-[#2a2a2a]",
        "border border-white/[0.06] hover:border-white/[0.1]"
      )}
      type="button"
    >
      {selectedToken ? (
        <>
          <div className="relative">
            <img
              alt={getTokenSymbol(selectedToken)}
              className="size-6 rounded-full ring-1 ring-white/10"
              src={TOKEN_ICON_BY_DEFUSE_ASSET_ID[selectedToken.assetId] ?? "/static/icons/empty.svg"}
            />
            <img
              alt={selectedToken.blockchain}
              className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full ring-2 ring-[#252525]"
              src={CHAIN_ICON[selectedToken.blockchain]}
            />
          </div>
          <span className="font-semibold text-sm tracking-tight">{getTokenSymbol(selectedToken)}</span>
        </>
      ) : (
        <span className="px-1 font-medium text-muted-foreground text-sm">Select</span>
      )}
      <ChevronRight className="size-4 text-muted-foreground/60 transition-colors group-hover:text-muted-foreground" />
    </button>
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSearch("");
      }}
    >
      <Dialog.Trigger>
        {renderTrigger || defaultTrigger}
      </Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "!p-0 w-[340px] overflow-hidden rounded-2xl",
          "border border-white/[0.08] bg-[#1c1c1c]",
          "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]"
        )}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <Dialog.Title className="font-semibold text-base tracking-tight">Select token</Dialog.Title>
            <Dialog.Close>
              <button
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  "text-muted-foreground hover:text-foreground",
                  "transition-all duration-200 hover:bg-white/5"
                )}
                type="button"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Select a token</Dialog.Description>

          <div className="px-3 pb-2">
            <div className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
              "border border-white/[0.06] bg-black/30",
              "transition-colors focus-within:border-white/[0.12]"
            )}>
              <SearchIcon className="size-4 text-muted-foreground/60" />
              <input
                className={cn(
                  "w-full bg-transparent text-sm outline-none",
                  "placeholder:text-muted-foreground/40"
                )}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search token"
                value={search}
              />
              {!!search && (
                <button
                  onClick={() => setSearch("")}
                  type="button"
                  className="text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="no-scrollbar flex max-h-[360px] flex-col overflow-y-auto px-2 pb-2">
            {filteredTokens.map((token, index) => {
              const tokenBalance = balances?.[token.assetId];
              const hasBalance = tokenBalance && tokenBalance.balance > 0n;

              return (
                <button
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "hover:bg-white/[0.04] active:bg-white/[0.06]",
                    "w-full text-left transition-all duration-150",
                    selectedToken?.assetId === token.assetId && "bg-white/[0.04]"
                  )}
                  key={token.assetId}
                  onClick={() => {
                    onSelectToken(token);
                    setOpen(false);
                  }}
                  style={{ animationDelay: `${index * 15}ms` }}
                  type="button"
                >
                  <div className="relative shrink-0">
                    <img
                      alt={getTokenSymbol(token)}
                      className="size-9 rounded-full ring-1 ring-white/10"
                      src={TOKEN_ICON_BY_DEFUSE_ASSET_ID[token.assetId] ?? "/static/icons/empty.svg"}
                    />
                    <img
                      alt={token.blockchain}
                      className="absolute -right-0.5 -bottom-0.5 size-4 rounded-full ring-2 ring-[#1c1c1c]"
                      src={CHAIN_ICON[token.blockchain]}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground/90 text-sm tracking-tight">{getTokenSymbol(token)}</p>
                    {token.price && (
                      <p className="text-muted-foreground/60 text-xs tabular-nums">
                        ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    {hasBalance ? (
                      <>
                        <p className="font-medium text-foreground/80 text-sm tabular-nums">
                          {formatTokenValue(tokenBalance.balance, tokenBalance.decimals, {
                            min: 0.0001,
                            fractionDigits: 4,
                          })}
                        </p>
                        {token.price && (
                          <p className="text-muted-foreground/50 text-xs tabular-nums">
                            ${(Number(formatTokenValue(tokenBalance.balance, tokenBalance.decimals, { fractionDigits: 6 })) * token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        )}
                      </>
                    ) : selectedToken?.assetId === token.assetId ? (
                      <div className="size-2 rounded-full bg-emerald-400" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SelectTokenOnlyDialog;
