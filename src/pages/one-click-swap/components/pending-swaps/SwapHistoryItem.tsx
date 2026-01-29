import { GetExecutionStatusResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { ArrowRight, CheckCircle, Clock, ExternalLink, Loader2, XCircle } from "lucide-react";
import { type FC, useEffect } from "react";

import { TOKEN_ICON_BY_DEFUSE_ASSET_ID } from "@/constants/tokens";
import { cn } from "@/shadcn/utils";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import { type SwapHistoryItem as SwapHistoryItemType, useSwapHistoryStore } from "@/stores/useSwapHistoryStore";
import { getTokenSymbol } from "@/utils";
import useSwapStatus from "../../queries/useSwapStatus";

const INTENTS_EXPLORER_URL = "https://explorer.near-intents.org";

const TERMINAL_STATUSES = [
  GetExecutionStatusResponse.status.SUCCESS,
  GetExecutionStatusResponse.status.REFUNDED,
  GetExecutionStatusResponse.status.FAILED,
];

type StatusConfig = {
  icon: typeof CheckCircle;
  color: string;
  label: string;
  animate?: boolean;
};

const STATUS_CONFIG: Record<GetExecutionStatusResponse.status, StatusConfig> = {
  [GetExecutionStatusResponse.status.SUCCESS]: {
    icon: CheckCircle,
    color: "text-emerald-400",
    label: "Completed",
  },
  [GetExecutionStatusResponse.status.KNOWN_DEPOSIT_TX]: {
    icon: Loader2,
    color: "text-amber-400",
    label: "Processing",
    animate: true,
  },
  [GetExecutionStatusResponse.status.PENDING_DEPOSIT]: {
    icon: Clock,
    color: "text-blue-400",
    label: "Pending",
  },
  [GetExecutionStatusResponse.status.PROCESSING]: {
    icon: Loader2,
    color: "text-amber-400",
    label: "Processing",
    animate: true,
  },
  [GetExecutionStatusResponse.status.FAILED]: {
    icon: XCircle,
    color: "text-red-400",
    label: "Failed",
  },
  [GetExecutionStatusResponse.status.REFUNDED]: {
    icon: XCircle,
    color: "text-orange-400",
    label: "Refunded",
  },
  [GetExecutionStatusResponse.status.INCOMPLETE_DEPOSIT]: {
    icon: XCircle,
    color: "text-red-400",
    label: "Failed",
  },
};

interface SwapHistoryItemProps {
  swap: SwapHistoryItemType;
}

const SwapHistoryItem: FC<SwapHistoryItemProps> = ({ swap }) => {
  const { tokensMap } = useOneClickSwapStore();
  const { updateSwapStatus } = useSwapHistoryStore();

  // Only poll for status if not terminal
  const shouldPoll = !TERMINAL_STATUSES.includes(swap.status);
  const { data } = useSwapStatus(shouldPoll ? swap.depositAddress : null);

  // Update store when status changes from API
  useEffect(() => {
    if (data?.status && data.status !== swap.status) {
      updateSwapStatus(
        swap.depositAddress,
        data.status,
        data.swapDetails.amountInFormatted,
        data.swapDetails.amountOutFormatted
      );
    }
  }, [data?.status, data?.swapDetails, swap.depositAddress, swap.status, updateSwapStatus]);

  const tokenIn = tokensMap[swap.tokenInAssetId];
  const tokenOut = tokensMap[swap.tokenOutAssetId];

  if (!tokenIn || !tokenOut) return null;

  const statusConfig = STATUS_CONFIG[swap.status];
  const StatusIcon = statusConfig.icon;
  const explorerUrl = `${INTENTS_EXPLORER_URL}/transactions/${swap.depositAddress}`;

  // Use API data if available, otherwise use stored data
  const amountIn = data?.swapDetails.amountInFormatted ?? swap.amountIn;
  const amountOut = data?.swapDetails.amountOutFormatted ?? swap.amountOut;

  return (
    <div className="py-3 px-3 flex items-center gap-3 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Token In */}
        <div className="w-[90px] flex-shrink-0 flex items-center gap-2">
          <img
            alt={getTokenSymbol(tokenIn)}
            className="size-6 rounded-full flex-shrink-0"
            src={TOKEN_ICON_BY_DEFUSE_ASSET_ID[tokenIn.assetId] ?? "/static/icons/empty.svg"}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">
              {amountIn}
            </span>
            <span className="text-xs text-white/50 truncate">{getTokenSymbol(tokenIn)}</span>
          </div>
        </div>

        <ArrowRight className="size-3.5 text-white/30 flex-shrink-0" />

        {/* Token Out */}
        <div className="w-[90px] flex-shrink-0 flex items-center gap-2">
          <img
            alt={getTokenSymbol(tokenOut)}
            className="size-6 rounded-full flex-shrink-0"
            src={TOKEN_ICON_BY_DEFUSE_ASSET_ID[tokenOut.assetId] ?? "/static/icons/empty.svg"}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">
              {amountOut}
            </span>
            <span className="text-xs text-white/50 truncate">{getTokenSymbol(tokenOut)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/70 transition-colors"
            onClick={(e) => e.stopPropagation()}
            title="View on explorer"
          >
            <ExternalLink className="size-3" />
          </a>
          <span className="text-white/20">·</span>
          <div className="flex items-center gap-1" title={statusConfig.label}>
            <StatusIcon
              className={cn(
                "size-3.5",
                statusConfig.color,
                statusConfig.animate && "animate-spin"
              )}
            />
            <span className={cn("text-xs", statusConfig.color)}>{statusConfig.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapHistoryItem;
