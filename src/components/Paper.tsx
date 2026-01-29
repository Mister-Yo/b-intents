import type { FC, PropsWithChildren } from "react";
import { useLocation } from "react-router";

import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/shadcn/utils";

type Props = PropsWithChildren & {
  className?: string;
};

const Paper: FC<Props> = ({ children, className }) => {
  const { pathname } = useLocation();
  const isSimpleSwap = pathname.includes(APP_ROUTES.SIMPLE_SWAP.SWAP);
  return (
    <div className="mt-7 flex min-w-0 flex-1 flex-col items-center justify-start md:mt-14">
      <div className="w-full px-3">
        <div className="flex justify-center">
          <div className={cn("w-full xs:w-[472px]", className)}>
            {children}
          </div>
          {isSimpleSwap && (
            <div className="relative hidden h-[433px] w-[472px] self-center lg:block">
              <img alt="Elephant in pool" className="h-full w-full object-cover" src="/static/elephant-in-pool.webp" />
            </div>
          )}
        </div>
      </div>
      {isSimpleSwap && (
        <div className="relative xs:mt-10 min-h-[327px] w-full xs:w-3/4 sm:min-h-[433px] lg:hidden">
          <img
            alt="Elephant in pool"
            className="absolute h-full w-full object-cover object-[60%_center] md:object-center"
            src="/static/elephant-in-pool.webp"
          />
        </div>
      )}
    </div>
  );
};

export default Paper;
