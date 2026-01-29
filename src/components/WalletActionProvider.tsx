import { observer } from "mobx-react-lite";
import type { FC, PropsWithChildren } from "react";

import { useConnectWallet } from "@/hooks/useConnectWallet";

import WalletListDialog from "./dialogs/WalletListDialog";

const WalletActionProvider: FC<PropsWithChildren> = observer(({ children }) => {
  const {
    state: { address },
  } = useConnectWallet();
  return address ? children : <WalletListDialog />;
});

export default WalletActionProvider;
