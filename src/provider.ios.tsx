import { useCallback, useMemo, useState } from 'react';
import { findNodeHandle } from 'react-native';

import { ScrollEdgeEffectContext, ScrollEdgeEffectRefContext } from './context';
import { isScrollEdgeEffectSupported } from './isScrollEdgeEffectSupported';

import type {
  ScrollEdgeEffectProviderProps,
  ScrollEdgeEffectRef,
} from './types';

export function ScrollEdgeEffectProvider({
  children,
}: ScrollEdgeEffectProviderProps) {
  const [scrollViewTag, setScrollViewTag] = useState<number | null>(null);

  const ref = useCallback<ScrollEdgeEffectRef>((node) => {
    if (!isScrollEdgeEffectSupported) {
      return;
    }

    if (node == null) {
      setScrollViewTag(null);
    } else {
      const tag = findNodeHandle(node);

      setScrollViewTag(tag ?? null);
    }
  }, []);

  const value = useMemo(() => ({ scrollViewTag }), [scrollViewTag]);

  return (
    <ScrollEdgeEffectContext.Provider value={value}>
      <ScrollEdgeEffectRefContext.Provider value={ref}>
        {children}
      </ScrollEdgeEffectRefContext.Provider>
    </ScrollEdgeEffectContext.Provider>
  );
}
