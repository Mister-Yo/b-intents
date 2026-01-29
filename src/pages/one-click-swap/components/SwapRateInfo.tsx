import type { QuoteResponse } from "@defuse-protocol/one-click-sdk-typescript";
import type { FC } from "react";
import { formatUnits } from "viem";

import { useOneClickSwapStore } from "@/stores/useOneClickSwapStore";

type Props = {
  swapQuote: QuoteResponse;
};

const SwapRateInfo: FC<Props> = ({ swapQuote }) => {
  const { tokenOut } = useOneClickSwapStore();

  const formatMinAmount = () => {
    if (!tokenOut) return "-";
    const formatted = formatUnits(BigInt(swapQuote.quote.minAmountOut), tokenOut.decimals);
    // Format to reasonable precision
    const num = Number(formatted);
    if (num < 0.0001) return num.toExponential(2);
    if (num < 1) return num.toFixed(4);
    if (num < 1000) return num.toFixed(2);
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const data = [
    {
      title: "Min received",
      value: formatMinAmount(),
      symbol: tokenOut?.symbol,
    },
  ];

  return (
    <div className="flex flex-col gap-2 mt-4 mb-4 px-1">
      {data.map(({ title, value, symbol }) => (
        <div className="flex justify-between items-center text-sm text-white/50" key={title}>
          <span>{title}</span>
          <span className="text-white/70">
            <span className="font-medium">{value}</span> {symbol}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SwapRateInfo;
