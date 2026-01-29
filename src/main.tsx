import { sdk } from "@farcaster/miniapp-sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Providers from "./providers";

import "@radix-ui/themes/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);

sdk.actions.ready();
