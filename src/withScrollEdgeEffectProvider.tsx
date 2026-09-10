import { ScrollEdgeEffectProvider } from './provider';

import type { ComponentType, FC } from 'react';

export function withScrollEdgeEffectProvider<
  Props extends NonNullable<unknown>,
>(Screen: ComponentType<Props>) {
  const Wrapped: FC<Props> = (props) => (
    <ScrollEdgeEffectProvider>
      <Screen {...props} />
    </ScrollEdgeEffectProvider>
  );

  Wrapped.displayName = `withScrollEdgeEffectProvider(${
    Screen.displayName || Screen.name || 'Screen'
  })`;

  return Wrapped;
}
