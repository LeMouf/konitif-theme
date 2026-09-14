import type { RuntimePhase } from '../konitifRuntimePhaseTokens';

export type AmbientQuality = 'off' | 'low' | 'medium' | 'high';

export type SpatialAmbientConfig = {
  phase: RuntimePhase;
  quality: AmbientQuality;
  reducedMotion: boolean;
  focusX: number;
  focusY: number;
};
