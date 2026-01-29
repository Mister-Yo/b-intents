import { TokenResponse } from "@defuse-protocol/one-click-sdk-typescript";
import { sha256 } from "@noble/hashes/sha2";
import { base58, bech32m, hex } from "@scure/base";
import { PublicKey } from "@solana/web3.js";

const ACCOUNT_ID_REGEX = /^(?=.{1,64}$)(?:[a-z\d]+(?:[-_][a-z\d]+)*(?:\.[a-z\d]+(?:[-_][a-z\d]+)*)*)(?:\.near|\.tg)$/;

const isLegitNEARAccountId = (accountId: string): boolean => {
  // Case 1: Exactly 64 chars, alphanumeric + _-
  if (/^[0-9a-f]{64}$/.test(accountId)) return true;

  // Case 2: Must end with `.near` or `.tg`
  return ACCOUNT_ID_REGEX.test(accountId);
};

export const validateAddress = (address: string, blockchain: TokenResponse.blockchain): boolean => {
  switch (blockchain) {
    case TokenResponse.blockchain.NEAR:
      return isLegitNEARAccountId(address);

    case TokenResponse.blockchain.ETH:
    case TokenResponse.blockchain.BASE:
    case TokenResponse.blockchain.ARB:
    case TokenResponse.blockchain.GNOSIS:
    case TokenResponse.blockchain.BERA:
    case TokenResponse.blockchain.BSC:
    case TokenResponse.blockchain.POL:
    case TokenResponse.blockchain.OP:
    case TokenResponse.blockchain.AVAX:
      // todo: Do we need to check checksum?
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case TokenResponse.blockchain.BTC:
      return (
        /^1[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address) ||
        /^3[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address) ||
        /^bc1[02-9ac-hj-np-z]{11,87}$/.test(address) ||
        /^bc1p[02-9ac-hj-np-z]{42,87}$/.test(address)
      );
    case TokenResponse.blockchain.SOL:
      try {
        return PublicKey.isOnCurve(address);
      } catch {
        return false;
      }

    case TokenResponse.blockchain.DOGE:
      return /^[DA][1-9A-HJ-NP-Za-km-z]{25,33}$/.test(address);

    case TokenResponse.blockchain.ZEC:
      return validateZcashAddress(address);

    case TokenResponse.blockchain.TRON:
      return validateTronAddress(address);

    case TokenResponse.blockchain.TON:
      return /^[EU]Q[0-9A-Za-z_-]{46}$/.test(address);

    case TokenResponse.blockchain.SUI:
      return /^(?:0x)?[a-fA-F0-9]{64}$/.test(address);

    // case TokenResponse.blockchain.STELLAR:
    //   return /^G[A-Z0-9]{55}$/.test(address);

    // case TokenResponse.blockchain.APTOS:
    //   return /^0x[a-fA-F0-9]{64}$/.test(address);

    default:
      return false;
  }
};

/**
 * Validates Zcash addresses
 * Supports:
 * - Transparent addresses (t1, t3)
 * - TEX addresses (tex1)
 */
const validateZcashAddress = (address: string): boolean => {
  // Transparent address validation
  if (address.startsWith("t1") || address.startsWith("t3")) {
    // t1 for P2PKH addresses, t3 for P2SH addresses
    return /^t[13][a-km-zA-HJ-NP-Z1-9]{33}$/.test(address);
  }

  // TEX address validation
  const expectedHrp = "tex";

  if (address.startsWith(`${expectedHrp}1`)) {
    try {
      const decoded = bech32m.decodeToBytes(address);

      if (decoded.prefix !== expectedHrp) {
        return false;
      }

      return decoded.bytes.length === 20;
    } catch {
      return false;
    }
  }

  return false;
};

/**
 * Validates Tron addresses
 * Supports:
 * - hex addresses
 * - base58 addresses
 * https://developers.tron.network/docs/account
 */
function validateTronAddress(address: string): boolean {
  return validateTronBase58Address(address) || validateTronHexAddress(address);
}

function validateTronBase58Address(address: string): boolean {
  try {
    const decoded = base58.decode(address);

    if (decoded.length !== 25) return false;

    // The first 21 bytes are the address data, the last 4 bytes are the checksum.
    const data = decoded.slice(0, 21);
    const checksum = decoded.slice(21);

    const expectedChecksum = sha256(sha256(data)).slice(0, 4);

    for (let i = 0; i < 4; i++) {
      if (checksum[i] !== expectedChecksum[i]) return false;
    }

    return data[0] === 0x41;
  } catch {
    return false;
  }
}

function validateTronHexAddress(address: string): boolean {
  try {
    const decoded = hex.decode(address);

    return decoded.length === 21 && decoded[0] === 0x41;
  } catch {
    return false;
  }
}
