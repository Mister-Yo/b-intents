import { HotConnector } from "@hot-labs/kit";

import { walletConnectProjectId } from "./index";

export const hotConnector = new HotConnector({
  apiKey: import.meta.env["VITE_HOT_LABS_API_KEY"] || "",
  walletConnect: {
    projectId: walletConnectProjectId,
    metadata: {
      name: "Jumbo Exchange",
      description: "Multi-chain DEX with NEAR Intents",
      url: typeof window !== "undefined" ? window.location.origin : "",
      icons: ["/favicon.ico"],
    },
  },
});
