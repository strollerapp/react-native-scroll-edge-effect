import type { ReactNode } from 'react';
import type {
  StyleProp,
  ViewProps,
  ViewStyle,
  findNodeHandle,
} from 'react-native';

export type ScrollEdge = 'top' | 'bottom';

export type ScrollEdgeColorScheme = 'light' | 'dark';

export type ScrollEdgeAppearance = {
  colorScheme: ScrollEdgeColorScheme;
};

export type ScrollEdgeAppearanceEvent = {
  nativeEvent: ScrollEdgeAppearance;
};

export type ScrollEdgeEffectViewProps = {
  children?: ReactNode;
  edge: ScrollEdge;
  height: number;
  fallback?: ReactNode;
  shouldAdaptToBackdrop?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type NativeScrollEdgeEffectViewProps = ViewProps & {
  scrollViewTag: number | null;
  edge: ScrollEdge;
  onAppearanceChange?: (event: ScrollEdgeAppearanceEvent) => void;
};

export type ScrollEdgeEffectProviderProps = {
  children: ReactNode;
};

export type ScrollEdgeEffectContextValue = {
  scrollViewTag: number | null;
};

export type ScrollEdgeEffectRef = (
  node: Parameters<typeof findNodeHandle>[0]
) => void;

export type ContainerStyleOptions = Pick<
  ScrollEdgeEffectViewProps,
  'edge' | 'height'
>;
