import type { RuntimePhase } from '../konitifRuntimePhaseTokens';
import { createRuntimeSpatialState } from './runtimeSpatialReactivity';

export type RuntimePhaseVisual = {
  tint: string;
  tintRgb: string;
  intensity: number;
};

export const runtimePhaseVisualMap = {
  BOOT: { tint: 'var(--k-accent-secondary)', tintRgb: '96, 165, 250', intensity: 0.35 },
  LAUNCH_GATE: { tint: 'var(--k-accent-primary)', tintRgb: '34, 211, 238', intensity: 0.42 },
  CONTEXT_RESOLVED: { tint: 'var(--k-accent-primary)', tintRgb: '34, 211, 238', intensity: 0.4 },
  PREFLIGHT: { tint: 'var(--k-accent-success)', tintRgb: '74, 222, 128', intensity: 0.48 },
  PLANNED: { tint: 'var(--k-accent-success)', tintRgb: '74, 222, 128', intensity: 0.44 },
  INITIALIZING: { tint: 'var(--k-accent-secondary)', tintRgb: '96, 165, 250', intensity: 0.58 },
  HYDRATING: { tint: 'var(--k-accent-hydration)', tintRgb: '168, 85, 247', intensity: 0.5 },
  RUNNING: { tint: 'var(--k-accent-primary)', tintRgb: '34, 211, 238', intensity: 0.62 },
  SUSPENDING: { tint: 'var(--k-accent-warning)', tintRgb: '245, 158, 11', intensity: 0.36 },
  SUSPENDED: { tint: 'var(--k-accent-warning)', tintRgb: '245, 158, 11', intensity: 0.26 },
  RESUMING: { tint: 'var(--k-accent-primary)', tintRgb: '34, 211, 238', intensity: 0.5 },
  TEARDOWN: { tint: 'var(--k-accent-warning)', tintRgb: '245, 158, 11', intensity: 0.32 },
  TEARING_DOWN: { tint: 'var(--k-accent-warning)', tintRgb: '245, 158, 11', intensity: 0.32 },
  RECOVERY: { tint: 'var(--k-accent-error)', tintRgb: '239, 68, 68', intensity: 0.6 },
  RECOVERING: { tint: 'var(--k-accent-error)', tintRgb: '239, 68, 68', intensity: 0.6 },
  SAFE_MODE: { tint: 'var(--k-accent-error)', tintRgb: '239, 68, 68', intensity: 0.28 }
} satisfies Record<RuntimePhase, RuntimePhaseVisual>;

export function resolveRuntimePhaseVisual(phase: RuntimePhase | string | null | undefined): RuntimePhaseVisual {
  const spatialState = createRuntimeSpatialState(phase);

  return {
    tint: spatialState.tint,
    tintRgb: spatialState.tintRgb,
    intensity: spatialState.lightIntensity
  };
}
