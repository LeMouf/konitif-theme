import { get, writable } from 'svelte/store';
import type { RuntimePhase } from '../konitifRuntimePhaseTokens';
import type { AmbientQuality } from '../ambient/spatialAmbientTypes';
import {
  createRuntimeSpatialState,
  type RuntimeSpatialState,
  type RuntimeSpatialStateOptions
} from './runtimeSpatialReactivity';

export type RuntimeSpatialStateStore = {
  subscribe: (run: (state: RuntimeSpatialState) => void) => () => void;
  updatePhase: (phase: RuntimePhase | string, options?: RuntimeSpatialStateOptions) => RuntimeSpatialState;
  updateOptions: (options: RuntimeSpatialStateOptions) => RuntimeSpatialState;
  getState: () => RuntimeSpatialState;
};

export function createRuntimeSpatialStateStore(
  phase: RuntimePhase | string = 'LAUNCH_GATE',
  options: RuntimeSpatialStateOptions = {}
): RuntimeSpatialStateStore {
  let currentPhase: RuntimePhase | string = phase;
  let currentOptions: RuntimeSpatialStateOptions = options;
  const state = writable(createRuntimeSpatialState(currentPhase, currentOptions));

  function setNext(nextPhase: RuntimePhase | string, nextOptions: RuntimeSpatialStateOptions): RuntimeSpatialState {
    currentPhase = nextPhase;
    currentOptions = nextOptions;
    const nextState = createRuntimeSpatialState(currentPhase, currentOptions);
    state.set(nextState);
    return nextState;
  }

  return {
    subscribe: state.subscribe,
    updatePhase(nextPhase, nextOptions = currentOptions) {
      return setNext(nextPhase, { ...currentOptions, ...nextOptions });
    },
    updateOptions(nextOptions) {
      return setNext(currentPhase, { ...currentOptions, ...nextOptions });
    },
    getState() {
      return get(state);
    }
  };
}

export function createRuntimeSpatialStateFromQuality(
  phase: RuntimePhase | string,
  quality: AmbientQuality,
  reducedMotion = false
): RuntimeSpatialState {
  return createRuntimeSpatialState(phase, { quality, reducedMotion });
}
