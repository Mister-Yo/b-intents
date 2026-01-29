import { observer } from "mobx-react-lite";

import { useConnectWallet } from "@/hooks/useConnectWallet";
import { Button } from "@/shadcn/ui/button";
import { cn } from "@/shadcn/utils";

import Wallet from "./icons/wallet";

type Props = {
  variant?: "default" | "oneclick";
};

const ConnectWallet = observer(({ variant = "default" }: Props) => {
  const { state, connect, disconnect } = useConnectWallet();

  const isOneClick = variant === "oneclick";

  if (state.address) {
    return (
      <Button
        className={cn(isOneClick && "border-white/20 bg-transparent text-white hover:bg-white/10")}
        onClick={disconnect}
        variant="outline"
      >
        <span className="max-w-[120px] truncate">{state.address}</span>
      </Button>
    );
  }

  return (
    <Button
      className={cn(
        isOneClick
          ? "bg-[#F05A28] hover:bg-[#ff7a00] text-white"
          : "bg-[var(--ruby-9)]"
      )}
      onClick={connect}
      type="button"
    >
      <Wallet />
      <span className="font-bold whitespace-nowrap">Connect Wallet</span>
    </Button>
  );
});

export default ConnectWallet;
