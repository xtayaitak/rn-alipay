import Alipay from './NativeAlipay';
import type { PayResult } from './NativeAlipay';

export function multiply(a: number, b: number): number {
  return Alipay.multiply(a, b);
}

export function pay(orderInfo: string): Promise<PayResult> {
  return Alipay.pay(orderInfo);
}

export function setScheme(scheme: string): void {
  return Alipay.setScheme(scheme);
}