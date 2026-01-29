import { useLocation } from "react-router";
import ConnectWallet from "@/components/ConnectWallet";
import Navbar from "@/components/Navbar";
import { APP_ROUTES } from "@/constants/routes";

const Header = () => {
  const { pathname } = useLocation();
  const isOneClickSwap = pathname === APP_ROUTES.ONE_CLICK_SWAP || pathname.startsWith("/swap/");

  if (isOneClickSwap) {
    return null;
  }

  return (
    <>
      <header className="z-50 h-[56px] w-full">
        <div className="flex h-full items-center justify-between px-3">
          <div className="lg:basis-[360px]" />
          <div className="hidden flex-1 justify-center lg:flex">
            <Navbar />
          </div>
          <div className="flex items-center justify-end gap-4 lg:basis-[360px]">
            <ConnectWallet />
          </div>
        </div>
      </header>
      <div className="no-scrollbar mt-6 flex min-h-10 xs:justify-center overflow-x-auto xs:p-0 px-4 lg:m-0 lg:hidden">
        <Navbar />
      </div>
    </>
  );
};

export default Header;
