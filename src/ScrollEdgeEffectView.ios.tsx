import { View, requireNativeComponent } from 'react-native';

import { useScrollEdgeEffectContext } from './hooks';
import { isScrollEdgeEffectSupported } from './isScrollEdgeEffectSupported';
import { getContainerStyle } from './styles';

import type {
  NativeScrollEdgeEffectViewProps,
  ScrollEdgeEffectViewProps,
} from './types';

const NativeScrollEdgeEffectView =
  requireNativeComponent<NativeScrollEdgeEffectViewProps>(
    'ScrollEdgeEffectView'
  );

export function ScrollEdgeEffectView({
  children,
  edge,
  effectStyle = 'automatic',
  height,
  fallback,
  style,
}: ScrollEdgeEffectViewProps) {
  const { scrollViewTag } = useScrollEdgeEffectContext();

  if (!isScrollEdgeEffectSupported) {
    return (
      <View
        style={[getContainerStyle({ edge, height }), style]}
        pointerEvents="box-none"
      >
        {fallback}

        {children}
      </View>
    );
  }

  return (
    <NativeScrollEdgeEffectView
      scrollViewTag={scrollViewTag}
      edge={edge}
      effectStyle={effectStyle}
      style={[getContainerStyle({ edge, height }), style]}
      pointerEvents="box-none"
    >
      {children}
    </NativeScrollEdgeEffectView>
  );
}
