import { Skeleton } from "@radix-ui/themes";
import { ArrowRight, CheckCircle, Clock, ExternalLink, Loader2, XCircle } from "lucide-react";
import type { FC } from "react";
import { useMemo } from "react";

import { TOKEN_ICON_BY_DEFUSE_ASSET_ID } from "@/constants/tokens";
import { cn } from "@/shadcn/utils";
import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";
import type { SwapTransaction, TokenAmount } from "@/types/history";
import { formatUsdAmount } from "@/utils/format";

const INTENTS_EXPLORER_URL = "https://explorer.near-intents.org";

const STATUS_CONFIG = {
  SUCCESS: {
    icon: CheckCircle,
    color: "text-emerald-400",
    label: "Completed",
  },
  PROCESSING: {
    icon: Loader2,
    color: "text-amber-400",
    label: "Processing",
    animate: true,
  },
  PENDING: {
    icon: Clock,
    color: "text-blue-400",
    label: "Pending",
  },
  FAILED: {
    icon: XCircle,
    color: "text-red-400",
    label: "Failed",
  },
} as const;

interface TokenDisplayProps {
  tokenAmount: TokenAmount;
}

function TokenDisplay({ tokenAmount }: TokenDisplayProps) {
  const { tokensMap } = useOneClickSwapStore();
  const token = tokensMap[tokenAmount.token_id];

  const icon = token
    ? TOKEN_ICON_BY_DEFUSE_ASSET_ID[token.assetId] ?? "/static/icons/empty.svg"
    : "/static/icons/empty.svg";

  const symbol = token?.symbol ?? (tokenAmount.symbol || "???");

  return (
    <div className="flex items-center gap-2 min-w-0">
      <img
        alt={symbol}
        className="size-6 rounded-full flex-shrink-0"
        src={icon}
      />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-white truncate">
          {tokenAmount.amount}
        </span>
        <span className="text-xs text-white/50 truncate">{symbol}</span>
      </div>
    </div>
  );
}

function formatSmartDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface HistoryItemProps {
  swap: SwapTransaction;
}

export const HistoryItem: FC<HistoryItemProps> = ({ swap }) => {
  const statusConfig = STATUS_CONFIG[swap.status];
  const StatusIcon = statusConfig.icon;

  const explorerUrl = useMemo(() => {
    if (!swap.deposit_address) return null;
    return `${INTENTS_EXPLORER_URL}/transactions/${swap.deposit_address}`;
  }, [swap.deposit_address]);

  const usdValue = swap.from.amount_usd ? formatUsdAmount(Number(swap.from.amount_usd)) : null;

  return (
    <div className="py-3 px-3 flex items-center gap-3 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-[90px] flex-shrink-0">
          <TokenDisplay tokenAmount={swap.from} />
        </div>
        <ArrowRight className="size-3.5 text-white/30 flex-shrink-0" />
        <div className="w-[90px] flex-shrink-0">
          <TokenDisplay tokenAmount={swap.to} />
        </div>
      </div>

      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        {usdValue && (
          <span className="text-sm font-medium text-white">{usdValue}</span>
        )}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-white/40">{formatSmartDate(swap.timestamp)}</span>
          {explorerUrl && (
            <>
              <span className="text-white/20">·</span>
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
            </>
          )}
          <span className="text-white/20">·</span>
          <div className="flex items-center" title={statusConfig.label}>
            <StatusIcon
              className={cn(
                "size-3.5",
                statusConfig.color,
                "animate" in statusConfig && statusConfig.animate && "animate-spin"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HistoryItemSkeleton: FC = () => {
  return (
    <div className="py-3 px-3 flex items-center gap-3 border-b border-white/[0.06] last:border-b-0">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-[90px] flex-shrink-0 flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-2.5 w-8" />
          </div>
        </div>
        <Skeleton className="size-3.5 rounded" />
        <div className="w-[90px] flex-shrink-0 flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-2.5 w-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};
