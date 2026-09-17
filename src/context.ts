import { createContext } from 'react';

import type {
  ScrollEdgeEffectContextValue,
  ScrollEdgeEffectRef,
} from './types';

export const ScrollEdgeEffectContext =
  createContext<ScrollEdgeEffectContextValue>({
    scrollViewTag: null,
  });

export const ScrollEdgeEffectRefContext =
  createContext<ScrollEdgeEffectRef | null>(null);
