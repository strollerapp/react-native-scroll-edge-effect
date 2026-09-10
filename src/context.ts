import { createContext } from 'react';

import type {
  ScrollEdgeColorScheme,
  ScrollEdgeEffectContextValue,
  ScrollEdgeEffectRef,
} from './types';

export const ScrollEdgeBackdropContext =
  createContext<ScrollEdgeColorScheme | null>(null);

export const ScrollEdgeEffectContext =
  createContext<ScrollEdgeEffectContextValue>({
    scrollViewTag: null,
  });

export const ScrollEdgeEffectRefContext =
  createContext<ScrollEdgeEffectRef | null>(null);
