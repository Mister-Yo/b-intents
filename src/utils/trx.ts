import { Big } from "big.js";

const BASE = 10;
const GAS_UNITS = 12;
const Tgas = Big(1).times(Big(BASE).pow(GAS_UNITS)).toFixed();

export const convertGas = (gas: string | number = 60): string => Big(gas).times(Tgas).toFixed();
