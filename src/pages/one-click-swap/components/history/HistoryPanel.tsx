import { ChevronDown, Clock, RefreshCw, Wallet } from "lucide-react";
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/shadcn/utils";
import type { SwapTransaction } from "@/types/history";
import { useSwapHistory } from "../../queries/useSwapHistory";
import { HistoryItem, HistoryItemSkeleton } from "./HistoryItem";

const POLLING_INTERVAL_MS = 15_000;
const RECENT_SWAP_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

interface HistoryPanelProps {
  accountId: string | null;
}

export const HistoryPanel: FC<HistoryPanelProps> = ({ accountId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    refetch,
  } = useSwapHistory(
    { accountId: accountId ?? "", limit: 20 },
    {
      enabled: Boolean(accountId) && isOpen,
      refetchOnMount: "always",
    }
  );

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  // Auto-refresh when there are pending transactions
  const hasRecentPendingSwaps = useMemo(() => {
    const now = Date.now();
    return items.some((swap) => {
      if (swap.status !== "PENDING" && swap.status !== "PROCESSING") {
        return false;
      }
      const swapTime = new Date(swap.timestamp).getTime();
      return now - swapTime < RECENT_SWAP_THRESHOLD_MS;
    });
  }, [items]);

  useEffect(() => {
    if (!hasRecentPendingSwaps || !isOpen) return;
    const interval = setInterval(() => refetch(), POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [hasRecentPendingSwaps, isOpen, refetch]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    const sentinel = loadMoreTriggerRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container || !hasNextPage || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: container,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isOpen]);

  const isRefreshing = isFetching && !isLoading && !isFetchingNextPage;

  return (
    <div
      className={cn(
        "mt-4 rounded-2xl overflow-hidden",
        "bg-[#1a1a1a] border border-white/[0.08]",
        "transition-all duration-300"
      )}
    >
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3",
          "hover:bg-white/[0.02] transition-colors"
        )}
      >
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-white/50" />
          <span className="text-sm font-medium text-white/70">Swap History</span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-white/50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Collapsible content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[400px]" : "max-h-0"
        )}
      >
        <div className="border-t border-white/[0.06]">
          {/* Refresh button when logged in */}
          {accountId && items.length > 0 && (
            <div className="flex justify-end px-3 py-2 border-b border-white/[0.06]">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  "text-white/40 hover:text-white/70 hover:bg-white/[0.05]",
                  isRefreshing && "opacity-50"
                )}
                title="Refresh"
              >
                <RefreshCw
                  className={cn("size-4", isRefreshing && "animate-spin")}
                />
              </button>
            </div>
          )}

          <Content
            isLoggedIn={Boolean(accountId)}
            items={items}
            isLoading={isLoading}
            isError={isError}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            scrollContainerRef={scrollContainerRef}
            loadMoreTriggerRef={loadMoreTriggerRef}
            onRetry={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

interface ContentProps {
  isLoggedIn: boolean;
  items: SwapTransaction[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  loadMoreTriggerRef: React.RefObject<HTMLDivElement | null>;
  onRetry: () => void;
}

function Content({
  isLoggedIn,
  items,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  scrollContainerRef,
  loadMoreTriggerRef,
  onRetry,
}: ContentProps) {
  if (isLoading) {
    return (
      <div className="px-1">
        <HistoryItemSkeleton />
        <HistoryItemSkeleton />
        <HistoryItemSkeleton />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Wallet className="size-8 mb-2 text-white/30" />
        <span className="text-sm font-medium text-white/50">Connect wallet to see history</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <span className="text-sm text-white/50 mb-2">Failed to load history</span>
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-medium text-white/70 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Clock className="size-8 mb-2 text-white/30" />
        <span className="text-sm font-medium text-white/50">No swaps yet</span>
        <span className="text-xs text-white/30 mt-1">Your swap history will appear here</span>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
    >
      {items.map((swap) => (
        <HistoryItem key={swap.id} swap={swap} />
      ))}

      {hasNextPage && <div ref={loadMoreTriggerRef} className="h-1" />}
      {isFetchingNextPage && <LoadingMoreIndicator />}
    </div>
  );
}

function LoadingMoreIndicator() {
  return (
    <div className="flex justify-center py-3">
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 bg-white/30 rounded-full animate-pulse" />
        <span
          className="size-1.5 bg-white/30 rounded-full animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="size-1.5 bg-white/30 rounded-full animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

export default HistoryPanel;
