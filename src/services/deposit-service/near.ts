import type { Transaction } from "@near-wallet-selector/core";
import { convertGas } from "@/utils/trx";
import { getNearNep141MinStorageBalance, getNearNep141StorageBalance } from "../balance-service";

const NEAR_TOKEN_ID = "near";
const STORAGE_TO_REGISTER_FT = "0.1";
const STORAGE_TO_REGISTER_WNEAR = "0.00125";
const ONE_YOCTO = "1";

export class NearFungibleTokenContract {
  readonly contractId: string;

  constructor({ contractId }: { contractId: string }) {
    this.contractId = contractId;
  }

  private async getStorageBalanceBounds() {
    return getNearNep141MinStorageBalance({ contractId: this.contractId });
  }

  private async getStorageBalance({ accountId }: { accountId: string }) {
    return getNearNep141StorageBalance({ accountId, contractId: this.contractId });
  }

  async checkStorageBalance({ accountId }: { accountId: string }) {
    try {
      if (this.contractId === NEAR_TOKEN_ID || this.contractId === "usn") return undefined;
      const storageBalance = await this.getStorageBalance({ accountId });

      if (!storageBalance) {
        const defaultStorageAmount =
          this.contractId === "wrap.near" ? STORAGE_TO_REGISTER_WNEAR : STORAGE_TO_REGISTER_FT;

        const storageAmount = (await this.getStorageBalanceBounds()).toString() || defaultStorageAmount;
        return this.createStorageDepositTransaction({ accountId, amount: storageAmount });
      }
      return undefined;
    } catch (e) {
      console.error(`Error while checkStorageBalance ${this.contractId}`, e);
      return undefined;
    }
  }

  private createStorageDepositTransaction({ accountId, amount }: { accountId: string; amount: string }): Transaction {
    return {
      signerId: accountId,
      receiverId: this.contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "storage_deposit",
            args: {
              account_id: accountId,
            },
            deposit: amount,
            gas: convertGas(),
          },
        },
      ],
    };
  }

  createFtTransferTransaction(
    signerId: string,
    ftTransferArgs: {
      receiver_id: string;
      amount: string;
      msg: string;
    },
  ): Transaction {
    return {
      signerId,
      receiverId: this.contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "ft_transfer",
            args: ftTransferArgs,
            deposit: ONE_YOCTO,
            gas: convertGas("300"),
          },
        },
      ],
    };
  }

  wrap({ signerId, amount }: { signerId: string; amount: string }): Transaction {
    if (this.contractId === NEAR_TOKEN_ID) throw Error("Can't wrap from NEAR token");
    return {
      signerId,
      receiverId: this.contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "near_deposit",
            deposit: amount,
            args: {},
            gas: convertGas("100"),
          },
        },
      ],
    };
  }

  unwrap({ signerId, amount }: { signerId: string; amount: string }): Transaction {
    if (this.contractId === NEAR_TOKEN_ID) throw Error("Can't wrap from NEAR token");
    return {
      signerId,
      receiverId: this.contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "near_withdraw",
            args: { amount },
            gas: convertGas("100"),
            deposit: ONE_YOCTO,
          },
        },
      ],
    };
  }

  static sendNear({
    signerId,
    amount,
    receiverId,
  }: {
    signerId: string;
    amount: string;
    receiverId: string;
  }): Transaction {
    return {
      signerId,
      receiverId,
      actions: [
        {
          type: "Transfer",
          params: {
            deposit: amount,
          },
        },
      ],
    };
  }
}
