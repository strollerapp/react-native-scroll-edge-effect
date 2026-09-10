import { useEffect, useState } from 'react';
import { View, requireNativeComponent, useColorScheme } from 'react-native';

import { ScrollEdgeBackdropContext } from './context';
import { useScrollEdgeEffectContext } from './hooks';
import { isScrollEdgeEffectSupported } from './isScrollEdgeEffectSupported';
import { getContainerStyle } from './styles';

import type {
  NativeScrollEdgeEffectViewProps,
  ScrollEdgeAppearanceEvent,
  ScrollEdgeColorScheme,
  ScrollEdgeEffectViewProps,
} from './types';

const NativeScrollEdgeEffectView =
  requireNativeComponent<NativeScrollEdgeEffectViewProps>(
    'ScrollEdgeEffectView'
  );

export function ScrollEdgeEffectView({
  children,
  edge,
  height,
  fallback,
  shouldAdaptToBackdrop = false,
  style,
}: ScrollEdgeEffectViewProps) {
  const { scrollViewTag } = useScrollEdgeEffectContext();
  const baseColorScheme = useColorScheme();
  const [backdropColorScheme, setBackdropColorScheme] =
    useState<ScrollEdgeColorScheme | null>(null);

  const adjustedColorScheme =
    backdropColorScheme === baseColorScheme ? null : backdropColorScheme;

  useEffect(() => {
    if (!shouldAdaptToBackdrop) {
      setBackdropColorScheme(null);
    }
  }, [shouldAdaptToBackdrop]);

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
      style={[getContainerStyle({ edge, height }), style]}
      pointerEvents="box-none"
      onAppearanceChange={
        shouldAdaptToBackdrop
          ? ({ nativeEvent }: ScrollEdgeAppearanceEvent) => {
              setBackdropColorScheme(nativeEvent.colorScheme);
            }
          : undefined
      }
    >
      <ScrollEdgeBackdropContext.Provider
        value={shouldAdaptToBackdrop ? adjustedColorScheme : null}
      >
        {children}
      </ScrollEdgeBackdropContext.Provider>
    </NativeScrollEdgeEffectView>
  );
}
