import { TurboModuleRegistry, type TurboModule } from 'react-native';

type ScrollEdgeEffectModuleConstants = {
  isSupported: boolean;
};

export interface Spec extends TurboModule {
  getConstants(): ScrollEdgeEffectModuleConstants;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeScrollEdgeEffectModule'
);
