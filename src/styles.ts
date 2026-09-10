import type { ContainerStyleOptions } from './types';
import type { ViewStyle } from 'react-native';

export function getContainerStyle({
  edge,
  height,
}: ContainerStyleOptions): ViewStyle {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    height,
    ...(edge === 'top' ? { top: 0 } : { bottom: 0 }),
  };
}
