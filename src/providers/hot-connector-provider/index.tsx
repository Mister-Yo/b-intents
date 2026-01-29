import type { HotConnector } from "@hot-labs/kit";
import { observer } from "mobx-react-lite";
import { createContext, useContext, type FC, type PropsWithChildren } from "react";

interface HotConnectorContextValue {
  connector: HotConnector;
}

const HotConnectorContext = createContext<HotConnectorContextValue | null>(null);

interface HotConnectorProviderProps extends PropsWithChildren {
  connector: HotConnector;
}

export const HotConnectorProvider: FC<HotConnectorProviderProps> = observer(({ connector, children }) => {
  return <HotConnectorContext.Provider value={{ connector }}>{children}</HotConnectorContext.Provider>;
});

export const useHotConnector = (): HotConnector => {
  const context = useContext(HotConnectorContext);
  if (!context) {
    throw new Error("useHotConnector must be used within HotConnectorProvider");
  }
  return context.connector;
};
