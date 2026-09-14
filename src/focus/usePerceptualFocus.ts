import { getContext, hasContext, setContext } from 'svelte';
import { globalPerceptualFocusStore } from './perceptualFocusStore';
import type { PerceptualFocusStore } from './perceptualFocusTypes';

const PERCEPTUAL_FOCUS_CONTEXT = Symbol('konitif.perceptual-focus');

export function setPerceptualFocusContext(store: PerceptualFocusStore): PerceptualFocusStore {
  setContext(PERCEPTUAL_FOCUS_CONTEXT, store);
  return store;
}

export function usePerceptualFocus(): PerceptualFocusStore {
  if (hasContext(PERCEPTUAL_FOCUS_CONTEXT)) {
    return getContext<PerceptualFocusStore>(PERCEPTUAL_FOCUS_CONTEXT);
  }

  return globalPerceptualFocusStore;
}
