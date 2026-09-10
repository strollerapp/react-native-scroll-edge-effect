import NativeScrollEdgeEffectModule from './NativeScrollEdgeEffectModule';

export const isScrollEdgeEffectSupported =
  NativeScrollEdgeEffectModule.getConstants().isSupported;
