import { ChevronDown, Clock, Loader2 } from "lucide-react";
import { type FC, useEffect, useState } from "react";

import { cn } from "@/shadcn/utils";
import { useSwapHistoryStore } from "@/stores/useSwapHistoryStore";
import SwapHistoryItem from "./SwapHistoryItem";

interface SwapHistoryPanelProps {
  userAddress: string | null;
}

export const SwapHistoryPanel: FC<SwapHistoryPanelProps> = ({ userAddress }) => {
  const { getSwapsForUser, hasPendingSwaps } = useSwapHistoryStore();
  const swaps = getSwapsForUser(userAddress);
  const hasPending = hasPendingSwaps(userAddress);

  // Auto-open when there are pending swaps, auto-close when all complete
  const [isOpen, setIsOpen] = useState(hasPending);

  useEffect(() => {
    if (hasPending) {
      setIsOpen(true);
      return undefined;
    }
    if (swaps.length > 0) {
      // Delay closing to show completed status briefly
      const timeout = setTimeout(() => setIsOpen(false), 2000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [hasPending, swaps.length]);

  // Don't render if no swaps at all
  if (swaps.length === 0) {
    return null;
  }

  const pendingCount = swaps.filter(
    (s) =>
      s.status !== "SUCCESS" &&
      s.status !== "REFUNDED" &&
      s.status !== "FAILED"
  ).length;

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
          {hasPending ? (
            <Loader2 className="size-4 text-[#F05A28] animate-spin" />
          ) : (
            <Clock className="size-4 text-white/50" />
          )}
          <span className="text-sm font-medium text-white/70">
            {hasPending
              ? `Pending Transactions (${pendingCount})`
              : "Recent Transactions"}
          </span>
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
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {swaps.map((swap) => (
              <SwapHistoryItem key={swap.depositAddress} swap={swap} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapHistoryPanel;
