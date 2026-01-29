// Transaction types - now handled by HotConnector
// Keeping minimal types for compatibility

export interface SendTransactionNearParams {
  transactions: Array<Record<string, unknown>>;
}

export type SendTransactionEVMParams = {
  transactions: Record<string, unknown>;
};

export type SendTransactionSolanaParams = {
  // Solana Transaction objects have their own structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transactions: any;
};

export type SendTransactionParams =
  | SendTransactionNearParams["transactions"]
  | SendTransactionEVMParams["transactions"]
  | SendTransactionSolanaParams["transactions"];
