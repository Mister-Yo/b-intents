import type { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { Dialog } from "@radix-ui/themes";
import { ChevronRight, SearchIcon, X } from "lucide-react";
import { type FC, useMemo, useState } from "react";

import { CHAIN_ICON, CHAIN_TITLE, TOKEN_ICON_BY_DEFUSE_ASSET_ID } from "@/constants/tokens";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { toDefuseAuthMethod } from "@/types/wallet";
import { authMethodToBlockchain } from "@/utils";
import { truncateAddress } from "@/utils/string";
import { getTokenSymbol } from "@/utils";

type Props = {
  typeToken: "in" | "out";
  selectedToken: TokenResponse;
  selectToken: (token: TokenResponse) => void;
};

/**
 * Only for One Click Swap Page(because the tokens are loaded on the one click swap page)
 */
const SelectTokenDialog: FC<Props> = ({ typeToken, selectToken, selectedToken }) => {
  const {
    state: { authMethod },
  } = useConnectWallet();

  const [selectedBlockchain, setSelectedBlockchain] = useState<TokenResponse.blockchain>();
  const [search, setSearch] = useState("");

  const { tokens } = useOneClickSwapStore();
  const { blockchains, blockchainSet } = useMemo(() => {
    const validBlockchains = typeToken === "in" ? authMethodToBlockchain(toDefuseAuthMethod(authMethod)) : null;
    const uniqueBlockchains = [...new Set(tokens.map(({ blockchain }) => blockchain))];
    const filteredSet = validBlockchains
      ? uniqueBlockchains.filter((b) => validBlockchains.includes(b))
      : uniqueBlockchains;

    const blockchains = filteredSet.map((blockchain) => ({
      blockchain,
      icon: CHAIN_ICON[blockchain],
      title: CHAIN_TITLE[blockchain],
    }));

    return { blockchains, blockchainSet: filteredSet };
  }, [authMethod, tokens, typeToken]);

  const currentSelectedBlockchains = blockchains.length === 1 ? blockchains[0].blockchain : selectedBlockchain;

  const filteredTokens = useMemo(() => {
    const lowerSearch = search?.toLowerCase();
    return tokens.filter(({ symbol, blockchain }) => {
      const matchesSearch = lowerSearch ? symbol.toLowerCase().includes(lowerSearch) : true;
      const matchesNetwork = currentSelectedBlockchains ? blockchain === currentSelectedBlockchains : true;
      const matchesType = typeToken === "in" ? blockchainSet.includes(blockchain) : true;

      return matchesSearch && matchesNetwork && matchesType;
    });
  }, [tokens, search, currentSelectedBlockchains, typeToken, blockchainSet]);

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) return;
        setSelectedBlockchain(undefined);
        setSearch("");
      }}
    >
      <Dialog.Trigger>
        <Button className="!px-2 h-auto gap-1 rounded-full py-1.5" type="button" variant="outline">
          <div className="relative">
            <img
              alt={getTokenSymbol(selectedToken)}
              className="size-7 rounded-full"
              src={TOKEN_ICON_BY_DEFUSE_ASSET_ID[selectedToken.assetId] ?? "/static/icons/empty.svg"}
            />
            <img
              alt={selectedToken?.blockchain ?? "blockchain"}
              className="absolute -right-1 -bottom-1 size-4 rounded-full border border-white"
              src={CHAIN_ICON[selectedToken?.blockchain]}
            />
          </div>
          <div className="ml-2 flex-1">
            <p className="max-w-14 truncate text-left font-semibold text-sm leading-[120%] tracking-[-0.32px] md:max-w-full md:whitespace-normal">
              {getTokenSymbol(selectedToken)}
            </p>
            <p className="text-left font-medium text-[10px] text-muted-foreground leading-[120%]">
              {selectedToken?.blockchain}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        className="!px-0 !pb-0 mt-1 max-w-xs rounded-2xl md:mr-[48px] dark:bg-black-800"
        minHeight={{ initial: "500px" }}
        minWidth={{ initial: "300px", xs: "330px" }}
      >
        <div className="flex flex-col gap-5">
          <Dialog.Title className="px-3">Select Token&Network</Dialog.Title>
          <Dialog.Description className="sr-only" />
          <div className="grid w-full items-center gap-1.5 px-3">
            <Label htmlFor="network">Select Network</Label>
            <Select
              disabled={blockchains.length === 1}
              onValueChange={(val) => setSelectedBlockchain(val as TokenResponse.blockchain)}
              value={currentSelectedBlockchains}
            >
              <SelectTrigger className="min-h-[42px] w-full">
                <SelectValue className="font-medium text-sm leading-5" id="network" placeholder="Select Network" />
              </SelectTrigger>
              <SelectContent>
                {blockchains.map(({ blockchain, title, icon }) => (
                  <SelectItem key={blockchain} value={blockchain}>
                    <img alt={title} className="size-[22px] rounded-full" src={icon} />
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-1.5 px-3">
            <Label htmlFor="token">Select Token</Label>

            <div className="flex w-full items-center gap-2 rounded-md border border-border border-solid bg-background p-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20">
              <SearchIcon className="size-4 text-muted-foreground" />
              <input
                className="w-full font-normal text-base leading-6 outline-none placeholder:text-muted-foreground"
                id="token"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search token"
                type="token"
                value={search}
              />
              {!!search && <X className="size-4 cursor-pointer" onClick={() => setSearch("")} />}
            </div>
          </div>

          <Dialog.Close>
            <div className="flex max-h-80 flex-col overflow-y-auto px-3 pb-3">
              {filteredTokens.map((token) => (
                <Button
                  className="justify-start gap-4 rounded-md px-3 py-2"
                  key={token.assetId}
                  onClick={() => selectToken(token)}
                  size="nosize"
                  variant="ghost"
                >
                  <div className="relative shrink-0">
                    <img
                      alt={getTokenSymbol(token)}
                      className="size-10 rounded-full"
                      src={TOKEN_ICON_BY_DEFUSE_ASSET_ID[token.assetId] ?? "/static/icons/empty.svg"}
                    />
                    <img
                      alt={token?.blockchain ?? "blockchain"}
                      className="absolute -right-0.5 -bottom-0.5 size-4 shrink-0 rounded-full border border-white"
                      src={CHAIN_ICON[token?.blockchain]}
                    />
                  </div>
                  <div>
                    <p className="text-left font-semibold text-base leading-[120%]">{getTokenSymbol(token)}</p>
                    <p className="text-left font-normal text-muted-foreground text-sm leading-[120%]">
                      {truncateAddress(token.contractAddress)}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SelectTokenDialog;
