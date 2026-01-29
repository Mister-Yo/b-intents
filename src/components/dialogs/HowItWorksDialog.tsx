import { Dialog } from "@radix-ui/themes";
import { CircleCheck, Download, InfoIcon, Upload } from "lucide-react";

import WalletIcon from "@/components/icons/wallet";

const HowItWorksDialog = () => {
  const helpers = [
    { icons: <Upload />, text: "Choose an asset you want to swap and its network" },
    { icons: <Download />, text: "Choose an asset you want to receive and its network" },
    { icons: <WalletIcon />, text: "Enter the recipient's wallet address" },
    { icons: <CircleCheck />, text: "Wait for the transaction to complete and enjoy your assets" },
  ];

  return (
    <Dialog.Root>
      <Dialog.Trigger className="cursor-pointer">
        <InfoIcon className="size-4" />
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[90vw] sm:!max-w-fit lg:!max-w-[1076px]" maxWidth={undefined}>
        <Dialog.Title className="text-center font-bold text-2xl">Cross-chain Swap</Dialog.Title>
        <Dialog.Description className="sr-only" />
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {helpers.map(({ icons, text }) => (
            <div
              className="flex flex-1 xs:flex-col items-start justify-between gap-8 self-stretch rounded-xl p-4 [background:#F1F5F9]"
              key={text}
            >
              <div className="rounded-lg bg-background p-2.5 [&_svg]:size-4">{icons}</div>
              <p className="font-medium text-base text-foreground leading-6">{text}</p>
            </div>
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default HowItWorksDialog;
