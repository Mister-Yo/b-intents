import { configureSDK } from "@defuse-protocol/defuse-sdk/config";
import { OpenAPI } from "@defuse-protocol/one-click-sdk-typescript";

import { currentEnvironment, oneClickUrl } from "./index";

let hasInitialized = false;

export function initSDK() {
  if (hasInitialized) {
    return;
  }
  hasInitialized = true;

  OpenAPI.BASE = oneClickUrl;

  configureSDK({
    env: currentEnvironment,
    logger: {
      verbose: console.info,
      info: console.info,
      warn: console.warn,
      error: console.error,
    },
  });
}
