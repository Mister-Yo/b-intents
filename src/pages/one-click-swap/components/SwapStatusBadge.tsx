import { GetExecutionStatusResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { Check, RefreshCcw, X } from "lucide-react";
import type { FC } from "react";

import LoadIcon from "@/components/icons/load";
import { cn } from "@/shadcn/utils";

type StatusConfig = {
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  text: string;
};

const STATUS_CONFIG: Record<GetExecutionStatusResponse.status, StatusConfig> = {
  [GetExecutionStatusResponse.status.KNOWN_DEPOSIT_TX]: {
    textColor: "text-[#563B00]",
    bgColor: "bg-[#FFF4D8]",
    borderColor: "border-[#DEC292]",
    icon: <LoadIcon className="size-3 animate-spin" />,
    text: "Processing",
  },
  [GetExecutionStatusResponse.status.PENDING_DEPOSIT]: {
    textColor: "text-[#563B00]",
    bgColor: "bg-[#FFF4D8]",
    borderColor: "border-[#DEC292]",
    icon: <LoadIcon className="size-3 animate-spin" />,
    text: "Processing",
  },
  [GetExecutionStatusResponse.status.PROCESSING]: {
    textColor: "text-[#563B00]",
    bgColor: "bg-[#FFF4D8]",
    borderColor: "border-[#DEC292]",
    icon: <LoadIcon className="size-3 animate-spin" />,
    text: "Processing",
  },
  [GetExecutionStatusResponse.status.SUCCESS]: {
    textColor: "text-[#005605]",
    bgColor: "bg-[#EDFFEE]",
    borderColor: "border-[#92DE96]",
    icon: <Check className="size-3" />,
    text: "Success",
  },
  [GetExecutionStatusResponse.status.REFUNDED]: {
    textColor: "text-[#008FB0]",
    bgColor: "bg-[#E3F1FF]",
    borderColor: "border-[#95C9D4]",
    icon: <RefreshCcw className="size-3" />,
    text: "Refunded",
  },
  [GetExecutionStatusResponse.status.INCOMPLETE_DEPOSIT]: {
    textColor: "text-[#B00003]",
    bgColor: "bg-[#FFE3E3]",
    borderColor: "border-[#D49595]",
    icon: <X className="size-3" />,
    text: "Failed",
  },
  [GetExecutionStatusResponse.status.FAILED]: {
    textColor: "text-[#B00003]",
    bgColor: "bg-[#FFE3E3]",
    borderColor: "border-[#D49595]",
    icon: <X className="size-3" />,
    text: "Failed",
  },
};

type Props = {
  status: GetExecutionStatusResponse.status;
  className?: string;
};

const SwapStatusBadge: FC<Props> = ({ status, className }) => {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-[100px] border border-solid px-2 py-1",
        config.textColor,
        config.bgColor,
        config.borderColor,
        className,
      )}
    >
      {config.icon}
      <p className="font-medium text-xs leading-[150%]">{config.text}</p>
    </div>
  );
};

export default SwapStatusBadge;
