import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface PayResult {
  resultStatus: string;
  result: string;
  memo: string;
}

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  pay(orderInfo: string): Promise<PayResult>;
  setScheme(scheme: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Alipay');
