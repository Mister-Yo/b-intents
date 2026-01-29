import { NavLink, useLocation } from "react-router";

import { APP_ROUTES, ONE_CLICK_SWAP_LINKS_HEADER, SIMPLE_SWAP_LINKS_HEADER } from "@/constants/routes";
import { Button } from "@/shadcn/ui/button";
import { cn } from "@/shadcn/utils";

// import ProductsDropdown from "./ProductsDropdown";

const Navbar = () => {
  const { pathname } = useLocation();
  const isSimpleSwap = pathname.includes(APP_ROUTES.SIMPLE_SWAP.SWAP);
  const isOneClickSwap = pathname === APP_ROUTES.ONE_CLICK_SWAP;

  // Hide navbar for one-click-swap page (logo is in Paper)
  if (isOneClickSwap) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between">
      {(isSimpleSwap ? SIMPLE_SWAP_LINKS_HEADER : ONE_CLICK_SWAP_LINKS_HEADER).map((route) => (
        <NavLink end key={route.label} to={route.href}>
          {({ isActive }) => {
            return (
              <div className="relative">
                <Button
                  className={cn(
                    "hover:bg-transparent hover:text-[var(--ruby-9)]",
                    isActive ? "cursor-default text-[var(--ruby-9)]" : "text-custom-gray",
                  )}
                  key={route.label}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {route.label}
                </Button>
                <div
                  className={cn(
                    "absolute h-1 w-full origin-center scale-x-0 cursor-default rounded-full bg-[var(--ruby-9)] transition-all",
                    isActive && "scale-x-100",
                  )}
                />
              </div>
            );
          }}
        </NavLink>
      ))}
      {/* <ProductsDropdown isSimpleSwap={isSimpleSwap} /> */}
    </nav>
  );
};

export default Navbar;
