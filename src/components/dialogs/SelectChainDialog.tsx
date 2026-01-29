import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { Dialog } from "@radix-ui/themes";
import { ChevronDown, SearchIcon, X } from "lucide-react";
import { type FC, useMemo, useState } from "react";

import { CHAIN_ICON, CHAIN_TITLE } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { toDefuseAuthMethod } from "@/types/wallet";
import { authMethodToBlockchain } from "@/utils";
import { cn } from "@/shadcn/utils";

type Props = {
  typeToken: "in" | "out";
  selectedBlockchain: TokenResponse.blockchain | null;
  onSelectBlockchain: (blockchain: TokenResponse.blockchain) => void;
};

const SelectChainDialog: FC<Props> = ({ typeToken, selectedBlockchain, onSelectBlockchain }) => {
  const {
    state: { authMethod },
  } = useConnectWallet();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { tokens } = useOneClickSwapStore();

  const blockchains = useMemo(() => {
    const validBlockchains = typeToken === "in" ? authMethodToBlockchain(toDefuseAuthMethod(authMethod)) : null;
    const uniqueBlockchains = [...new Set(tokens.map(({ blockchain }) => blockchain))];
    const filteredSet = validBlockchains
      ? uniqueBlockchains.filter((b) => validBlockchains.includes(b))
      : uniqueBlockchains;

    return filteredSet.map((blockchain) => ({
      blockchain,
      icon: CHAIN_ICON[blockchain],
      title: CHAIN_TITLE[blockchain],
    }));
  }, [authMethod, tokens, typeToken]);

  const filteredBlockchains = useMemo(() => {
    const lowerSearch = search?.toLowerCase();
    return blockchains.filter(({ title }) => {
      return lowerSearch ? title.toLowerCase().includes(lowerSearch) : true;
    });
  }, [blockchains, search]);

  const selectedChainData = selectedBlockchain
    ? { icon: CHAIN_ICON[selectedBlockchain], title: CHAIN_TITLE[selectedBlockchain] }
    : null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSearch("");
      }}
    >
      <Dialog.Trigger>
        <button
          className={cn(
            "group flex items-center gap-1.5 px-2 py-1 -ml-2",
            "rounded-lg transition-all duration-200",
            "hover:bg-white/5"
          )}
          type="button"
        >
          {selectedChainData ? (
            <>
              <img
                alt={selectedChainData.title}
                className="size-5 rounded-full ring-1 ring-white/10"
                src={selectedChainData.icon}
              />
              <span className="font-medium text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                {selectedChainData.title}
              </span>
            </>
          ) : (
            <span className="font-medium text-sm text-muted-foreground">Select</span>
          )}
          <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground/70 transition-colors" />
        </button>
      </Dialog.Trigger>
      <Dialog.Content
        className={cn(
          "!p-0 w-[320px] rounded-2xl overflow-hidden",
          "bg-[#1c1c1c] border border-white/[0.08]",
          "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]"
        )}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-5 py-4">
            <Dialog.Title className="font-semibold text-base tracking-tight">Select chain</Dialog.Title>
            <Dialog.Close>
              <button
                className={cn(
                  "size-8 flex items-center justify-center rounded-lg",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-white/5 transition-all duration-200"
                )}
                type="button"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Select a blockchain network</Dialog.Description>

          <div className="px-3 pb-2">
            <div className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
              "bg-black/30 border border-white/[0.06]",
              "focus-within:border-white/[0.12] transition-colors"
            )}>
              <SearchIcon className="size-4 text-muted-foreground/60" />
              <input
                className={cn(
                  "w-full bg-transparent text-sm outline-none",
                  "placeholder:text-muted-foreground/40"
                )}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chain"
                value={search}
              />
              {!!search && (
                <button
                  onClick={() => setSearch("")}
                  type="button"
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col max-h-[320px] overflow-y-auto px-2 pb-2 no-scrollbar">
            {filteredBlockchains.map(({ blockchain, title, icon }, index) => (
              <button
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-xl",
                  "hover:bg-white/[0.04] active:bg-white/[0.06]",
                  "transition-all duration-150 text-left",
                  selectedBlockchain === blockchain && "bg-white/[0.04]"
                )}
                key={blockchain}
                onClick={() => {
                  onSelectBlockchain(blockchain);
                  setOpen(false);
                }}
                style={{ animationDelay: `${index * 20}ms` }}
                type="button"
              >
                <img
                  alt={title}
                  className="size-10 rounded-full ring-1 ring-white/10"
                  src={icon}
                />
                <span className="font-medium text-base text-foreground/90">{title}</span>
                {selectedBlockchain === blockchain && (
                  <div className="ml-auto size-2.5 rounded-full bg-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SelectChainDialog;
