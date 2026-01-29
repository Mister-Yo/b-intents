import { useState } from "react";
import { useSearchParams } from "react-router";

import { decodeOrder, encodeOrder } from "@/pages/simple-swap/otc-desk/utils/encoder";

export function createOTCOrderLink(payload: unknown): string {
  const url = new URL("/otc-desk/view-order", window.location.origin);
  url.searchParams.set("order", encodeOrder(payload));
  return url.toString();
}

export const useOTCOrder = () => {
  const [searchParams] = useSearchParams();
  const encodedOrder = searchParams.get("order");

  const [payload] = useState(() => {
    try {
      return decodeOrder(encodedOrder ?? "");
    } catch (e) {
      console.error("Error while useOTCOrder", e);
      return "";
    }
  });

  return payload;
};
