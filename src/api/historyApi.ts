import type { SwapHistoryParams, SwapHistoryResponse, SwapTransaction } from "@/types/history";

const NEAR_INTENTS_API_URL = "https://near-intents.org/api";
const REQUEST_TIMEOUT_MS = 30_000;

interface NearIntentsHistoryResponse {
  data: SwapTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export async function fetchSwapHistory(params: SwapHistoryParams): Promise<SwapHistoryResponse> {
  const { accountId, page = 1, limit = 20 } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const url = `${NEAR_INTENTS_API_URL}/balance-history/${accountId}?${searchParams}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as NearIntentsHistoryResponse;

    return {
      data: json.data,
      pagination: json.pagination,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}
