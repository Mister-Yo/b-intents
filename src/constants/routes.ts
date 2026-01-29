export const APP_ROUTES = {
  ONE_CLICK_SWAP: "/",
  SWAP_PAIR: "/swap/:pair",
  SIMPLE_SWAP: {
    SWAP: "/simple-swap",
    ACCOUNT: "/simple-swap/account",
    DEPOSIT: "/simple-swap/deposit",
    WITHDRAW: "/simple-swap/withdraw",
    OTC_CREATE_ORDER: "/simple-swap/otc-desk/create-order",
    OTC_VIEW_ORDER: "/simple-swap/otc-desk/view-order",
    CREATE_GIFT: "/simple-swap/gift-card/create-gift",
    VIEW_GIFT: "/simple-swap/gift-card/view-gift",
  },
  MY_NEAR_WALLET_GATEWAY: "/my-near-wallet-gateway",
} as const;

export type NavigationLinks = {
  href: string;
  label: string;
};

export const SIMPLE_SWAP_LINKS_HEADER: NavigationLinks[] = [
  { href: APP_ROUTES.SIMPLE_SWAP.ACCOUNT, label: "Account" },
  { href: APP_ROUTES.SIMPLE_SWAP.DEPOSIT, label: "Deposit" },
  { href: APP_ROUTES.SIMPLE_SWAP.SWAP, label: "Swap" },
  { href: APP_ROUTES.SIMPLE_SWAP.WITHDRAW, label: "Withdraw" },
];

export const ONE_CLICK_SWAP_LINKS_HEADER: NavigationLinks[] = [{ href: APP_ROUTES.ONE_CLICK_SWAP, label: "Swap" }];

export const JUMBO_EXCHANGE_V1 = "https://jumbo.exchange/swap";
