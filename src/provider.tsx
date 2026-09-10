import { ScrollEdgeEffectRefContext } from './context';

import type {
  ScrollEdgeEffectProviderProps,
  ScrollEdgeEffectRef,
} from './types';

const noopScrollEdgeEffectRef: ScrollEdgeEffectRef = () => {};

export function ScrollEdgeEffectProvider({
  children,
}: ScrollEdgeEffectProviderProps) {
  return (
    <ScrollEdgeEffectRefContext.Provider value={noopScrollEdgeEffectRef}>
      {children}
    </ScrollEdgeEffectRefContext.Provider>
  );
}
