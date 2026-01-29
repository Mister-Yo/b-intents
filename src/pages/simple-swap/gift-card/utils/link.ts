import { useState } from "react";

import { decodeGift, encodeGift } from "./encoder";

export function createGiftCardLink(payload: unknown): string {
  const url = new URL("/gift-card/view-gift", window.location.origin);
  url.hash = encodeGift(payload);
  return url.toString();
}

export function useGiftCard() {
  const [payload] = useState(() => {
    try {
      const encodedGift = window.location.hash.slice(1);
      return decodeGift(encodedGift ?? "");
    } catch (e) {
      console.error(e);
      return "";
    }
  });

  return payload;
}
