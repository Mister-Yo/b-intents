import { Navigate, Route, Routes } from "react-router";

import { APP_ROUTES } from "@/constants/routes";
import OneClickSwap from "@/pages/one-click-swap";
import SwapPairPage from "@/pages/swap-pair";
import Account from "@/pages/simple-swap/account";
import Deposit from "@/pages/simple-swap/deposit";
import CreateGiftPage from "@/pages/simple-swap/gift-card/create-gift";
import ViewGiftPage from "@/pages/simple-swap/gift-card/view-gift";
import CreateOrderPage from "@/pages/simple-swap/otc-desk/create-order";
import ViewOrderPage from "@/pages/simple-swap/otc-desk/view-order";
import Swap from "@/pages/simple-swap/swap";
import Withdraw from "@/pages/simple-swap/withdraw";

const Pages = () => {
  return (
    <Routes>
      {/* ONE_CLICK_SWAP */}
      <Route element={<OneClickSwap />} path={APP_ROUTES.ONE_CLICK_SWAP} />

      {/* SEO SWAP PAIR PAGES */}
      <Route element={<SwapPairPage />} path={APP_ROUTES.SWAP_PAIR} />

      {/* SIMPLE_SWAP */}
      <Route element={<Account />} path={APP_ROUTES.SIMPLE_SWAP.ACCOUNT} />
      <Route element={<CreateGiftPage />} path={APP_ROUTES.SIMPLE_SWAP.CREATE_GIFT} />
      <Route element={<ViewGiftPage />} path={APP_ROUTES.SIMPLE_SWAP.VIEW_GIFT} />
      <Route element={<Deposit />} path={APP_ROUTES.SIMPLE_SWAP.DEPOSIT} />
      <Route element={<Swap />} path={APP_ROUTES.SIMPLE_SWAP.SWAP} />
      <Route element={<CreateOrderPage />} path={APP_ROUTES.SIMPLE_SWAP.OTC_CREATE_ORDER} />
      <Route element={<ViewOrderPage />} path={APP_ROUTES.SIMPLE_SWAP.OTC_VIEW_ORDER} />
      <Route element={<Withdraw />} path={APP_ROUTES.SIMPLE_SWAP.WITHDRAW} />

      <Route element={<Navigate replace to={APP_ROUTES.ONE_CLICK_SWAP} />} path="*" />
    </Routes>
  );
};

export default Pages;
