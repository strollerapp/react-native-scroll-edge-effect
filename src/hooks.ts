import { useContext } from 'react';

import {
  ScrollEdgeBackdropContext,
  ScrollEdgeEffectContext,
  ScrollEdgeEffectRefContext,
} from './context';

export function useScrollEdgeBackdropColorScheme() {
  return useContext(ScrollEdgeBackdropContext);
}

export function useScrollEdgeEffectRef() {
  const ref = useContext(ScrollEdgeEffectRefContext);

  if (ref === null) {
    throw new Error(
      'useScrollEdgeEffectRef must be used within a ScrollEdgeEffectProvider'
    );
  }

  return ref;
}

export function useScrollEdgeEffectContext() {
  return useContext(ScrollEdgeEffectContext);
}
