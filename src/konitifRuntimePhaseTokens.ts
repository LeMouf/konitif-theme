import type { LaunchPhase } from '@konitif/workbench';

export type RuntimePhase = LaunchPhase | 'TEARING_DOWN' | 'RECOVERING';

export function normalizeKonitifRuntimePhase(phase: RuntimePhase | string | null | undefined): RuntimePhase {
  if (phase === 'TEARING_DOWN') {
    return 'TEARDOWN';
  }

  if (phase === 'RECOVERING') {
    return 'RECOVERY';
  }

  return (phase || 'LAUNCH_GATE') as RuntimePhase;
}
