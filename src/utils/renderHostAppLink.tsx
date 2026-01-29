import type { ReactNode } from "react";
import { Link } from "react-router";

import { APP_ROUTES } from "@/constants/routes";
import { useSignInWindowOpenState } from "@/stores/useSignInWindowOpenState";

export function renderAppLink(
  routeName: "withdraw" | "deposit" | "gift" | "sign-in" | "swap" | "otc" | "account",
  children: ReactNode,
  props: { className?: string },
) {
  switch (routeName) {
    case "deposit":
      return (
        <Link to={APP_ROUTES.SIMPLE_SWAP.DEPOSIT} {...props}>
          {children}
        </Link>
      );
    case "withdraw":
      return (
        <Link to={APP_ROUTES.SIMPLE_SWAP.WITHDRAW} {...props}>
          {children}
        </Link>
      );
    case "gift":
      return (
        <Link to={APP_ROUTES.SIMPLE_SWAP.CREATE_GIFT} {...props}>
          {children}
        </Link>
      );
    case "sign-in":
      return (
        <div
          onClick={() => {
            useSignInWindowOpenState.getState().setIsOpen(true);
          }}
          {...props}
        >
          {children}
        </div>
      );
    case "swap":
      return (
        <Link to={APP_ROUTES.SIMPLE_SWAP.SWAP} {...props}>
          {children}
        </Link>
      );
    case "otc":
      return (
        <Link to={APP_ROUTES.SIMPLE_SWAP.OTC_CREATE_ORDER} {...props}>
          {children}
        </Link>
      );
    case "account":
      return (
        <Link to={APP_ROUTES.SIMPLE_SWAP.ACCOUNT} {...props}>
          {children}
        </Link>
      );
    default:
      return <div {...props}>{children}</div>;
  }
}
