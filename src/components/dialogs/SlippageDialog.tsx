import { Dialog } from "@radix-ui/themes";
import { type FC, useState } from "react";

import Check from "@/components/icons/check";
import Cross from "@/components/icons/cross";
import PercentIcon from "@/components/icons/percent";
import { Button } from "@/shadcn/ui/button";
import localStorageService from "@/utils/localStorage";

const recommendedSlippages = ["1", "3", "5", "10"];

type Props = { defaultSlippage: string; apply: (slippage: string) => void };

const SlippageDialog: FC<Props> = ({ defaultSlippage, apply }) => {
  const [slippage, setSlippage] = useState<string>(defaultSlippage);

  const isValidSlippage = Number(slippage) >= 0 && Number(slippage) <= 100;

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button type="button" variant="outline">
          <PercentIcon />
          Slippage Tolerance ({defaultSlippage}%)
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-96">
        <Dialog.Title className="text-left font-bold text-2xl">Slippage</Dialog.Title>
        <Dialog.Description className="font-normal text-slate-500 text-sm leading-[100%]">
          Set the maximum amount of slippage
        </Dialog.Description>
        <div className="mt-6 flex items-center justify-between gap-4 self-stretch rounded-xl border border-slate-200 p-3 shadow-xs">
          <input
            className="w-full bg-transparent font-normal text-sm leading-[120%] outline-none"
            inputMode="decimal"
            name="slippage"
            onChange={(e) => setSlippage(e.target.value)}
            onWheel={(event) => event.currentTarget.blur()}
            placeholder="0"
            type="number"
            value={slippage}
          />
          {isValidSlippage ? (
            <Check.Square className="flex size-4 shrink-0" />
          ) : (
            <Cross.Square className="flex size-4 shrink-0" />
          )}
        </div>
        <div className="mt-3 flex w-full gap-2">
          {recommendedSlippages.map((el) => (
            <Button
              className="rounded-full"
              disabled={slippage === el}
              key={el}
              onClick={() => {
                setSlippage(el);
              }}
              type="button"
              variant={slippage === el ? "default" : "secondary"}
            >
              {el}%
            </Button>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <Dialog.Close>
            <Button onClick={() => setSlippage(defaultSlippage)} type="button" variant="outline">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              disabled={!isValidSlippage || Number(slippage) === Number(defaultSlippage)}
              onClick={() => {
                apply(slippage);
                localStorageService.setItem("slippage", slippage);
              }}
              type="button"
            >
              Apply
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SlippageDialog;
