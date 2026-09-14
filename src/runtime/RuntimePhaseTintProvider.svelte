<script lang="ts">
  import { normalizeKonitifRuntimePhase, type RuntimePhase } from '../konitifRuntimePhaseTokens';
  import { resolveRuntimePhaseVisual } from './runtimePhaseVisualMap';

  export let phase: RuntimePhase = 'LAUNCH_GATE';

  $: visual = resolveRuntimePhaseVisual(normalizeKonitifRuntimePhase(phase));
</script>

<div
  class="phase-tint"
  style={`--phase-tint:${visual.tint}; --phase-tint-rgb:${visual.tintRgb}; --phase-intensity:${visual.intensity}`}
>
  <slot />
</div>

<style>
  .phase-tint {
    --phase-tint: var(--k-accent-primary);
    --phase-tint-rgb: 34, 211, 238;
    --phase-intensity: 0.5;
  }

  .phase-tint :global(.phase-aware) {
    border-color: var(--k-border-soft);
    box-shadow: 0 0 calc(24px * var(--phase-intensity)) rgba(var(--phase-tint-rgb), 0.18);
  }
</style>
