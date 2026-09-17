import type { ReactNode } from 'react';
import type {
  StyleProp,
  ViewProps,
  ViewStyle,
  findNodeHandle,
} from 'react-native';

export type ScrollEdge = 'top' | 'bottom';

export type ScrollEdgeEffectStyle = 'automatic' | 'soft' | 'hard';

export type ScrollEdgeEffectViewProps = {
  children?: ReactNode;
  edge: ScrollEdge;
  effectStyle?: ScrollEdgeEffectStyle;
  height: number;
  fallback?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type NativeScrollEdgeEffectViewProps = ViewProps & {
  scrollViewTag: number | null;
  edge: ScrollEdge;
  effectStyle: ScrollEdgeEffectStyle;
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
