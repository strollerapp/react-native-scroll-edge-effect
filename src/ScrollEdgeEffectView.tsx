import { View } from 'react-native';

import { getContainerStyle } from './styles';

import type { ScrollEdgeEffectViewProps } from './types';

export function ScrollEdgeEffectView({
  children,
  edge,
  height,
  fallback,
  style,
}: ScrollEdgeEffectViewProps) {
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
