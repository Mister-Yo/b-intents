import { ChevronDown } from "lucide-react";
import { type FC, useState } from "react";
import { Link } from "react-router";

import { APP_ROUTES, JUMBO_EXCHANGE_V1 } from "@/constants/routes";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { cn } from "@/shadcn/utils";

type Props = {
  isSimpleSwap: boolean;
};

const ProductsDropdown: FC<Props> = ({ isSimpleSwap }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="text-custom-gray hover:bg-transparent hover:text-custom-gray" type="button" variant="ghost">
          Products
          <ChevronDown className={cn("transition-transform", isOpen && "rotate-x-180")} size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isSimpleSwap ? (
          <DropdownMenuItem asChild className="gap-0">
            <Link to={APP_ROUTES.ONE_CLICK_SWAP}>
              One Click Swap
              <img alt="arrow-up-right" src="/static/icons/arrow-up-right.svg" />
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild className="gap-0">
            <Link to={APP_ROUTES.SIMPLE_SWAP.SWAP}>
              Simple Swap
              <img alt="arrow-up-right" src="/static/icons/arrow-up-right.svg" />
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="gap-0">
          <a href={JUMBO_EXCHANGE_V1}>
            Jumbo.Exchange
            <img alt="arrow-up-right" src="/static/icons/arrow-up-right.svg" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductsDropdown;
