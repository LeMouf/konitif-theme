import { get, writable } from 'svelte/store';
import type {
  PerceptualFocusPoint,
  PerceptualFocusState,
  PerceptualFocusStore,
  PerceptualFocusUpdate,
  PerceptualSurfaceRegistration
} from './perceptualFocusTypes';

export const DEFAULT_PERCEPTUAL_FOCUS_STATE: PerceptualFocusState = {
  activeSurfaceId: null,
  activeRole: null,
  activeDepth: null,
  focusPoint: { x: 0.5, y: 0.42 },
  focusStrength: 0
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function resolveFocusPoint(focusPoint?: Partial<PerceptualFocusPoint>): PerceptualFocusPoint {
  return {
    x: clamp01(focusPoint?.x ?? DEFAULT_PERCEPTUAL_FOCUS_STATE.focusPoint.x),
    y: clamp01(focusPoint?.y ?? DEFAULT_PERCEPTUAL_FOCUS_STATE.focusPoint.y)
  };
}

export function createPerceptualFocusStore(
  initialState: Partial<PerceptualFocusState> = {}
): PerceptualFocusStore {
  const surfaces = new Map<string, PerceptualSurfaceRegistration>();
  const state = writable<PerceptualFocusState>({
    ...DEFAULT_PERCEPTUAL_FOCUS_STATE,
    ...initialState,
    focusPoint: resolveFocusPoint(initialState.focusPoint),
    focusStrength: clamp01(initialState.focusStrength ?? DEFAULT_PERCEPTUAL_FOCUS_STATE.focusStrength)
  });

  return {
    subscribe: state.subscribe,
    registerSurface(surface) {
      surfaces.set(surface.id, surface);
    },
    unregisterSurface(surfaceId) {
      surfaces.delete(surfaceId);
      state.update((current) =>
        current.activeSurfaceId === surfaceId
          ? { ...DEFAULT_PERCEPTUAL_FOCUS_STATE, focusPoint: current.focusPoint }
          : current
      );
    },
    setActiveSurface(update: PerceptualFocusUpdate) {
      surfaces.set(update.id, {
        id: update.id,
        role: update.role,
        depth: update.depth
      });

      state.set({
        activeSurfaceId: update.id,
        activeRole: update.role,
        activeDepth: update.depth,
        focusPoint: resolveFocusPoint(update.focusPoint),
        focusStrength: clamp01(update.focusStrength ?? 1)
      });
    },
    clearActiveSurface(surfaceId) {
      state.update((current) => {
        if (surfaceId && current.activeSurfaceId !== surfaceId) {
          return current;
        }

        return {
          ...current,
          activeSurfaceId: null,
          activeRole: null,
          activeDepth: null,
          focusStrength: 0
        };
      });
    },
    setFocusPoint(focusPoint) {
      state.update((current) => ({
        ...current,
        focusPoint: resolveFocusPoint({ ...current.focusPoint, ...focusPoint })
      }));
    },
    getState() {
      return get(state);
    },
    getSurface(surfaceId) {
      return surfaces.get(surfaceId) ?? null;
    }
  };
}

export const globalPerceptualFocusStore = createPerceptualFocusStore();
