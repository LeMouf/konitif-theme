<script lang="ts">
  import type { RuntimePhase } from '../konitifRuntimePhaseTokens';
  import type { RuntimeSpatialState } from '../runtime/runtimeSpatialReactivity';
  import type { AmbientQuality } from './spatialAmbientTypes';

  export let phase: RuntimePhase = 'LAUNCH_GATE';
  export let quality: AmbientQuality = 'medium';
  export let reducedMotion = false;
  export let spatialState: RuntimeSpatialState | null = null;
  export let themeMode: 'dark' | 'light' = 'dark';

  const countByQuality: Record<AmbientQuality, number> = {
    off: 0,
    low: 18,
    medium: 42,
    high: 72
  };

  $: particleCount = Math.round(countByQuality[quality] * (spatialState?.particleDensity ?? 1));
  $: speedFactor = Math.max(0.08, spatialState?.particleSpeed ?? 0.3);
  $: particles = Array.from({ length: particleCount }, (_, index) => ({
    id: index,
    x: (index * 37) % 100,
    y: (index * 61) % 100,
    size: 1 + (index % 4),
    duration: (10 + (index % 9)) / speedFactor,
    depth: 0.22 + (index % 7) * 0.08
  }));
</script>

<div
  class:reducedMotion
  class="particles"
  data-phase={phase}
  data-theme-mode={themeMode}
  style={`--particle-speed:${speedFactor};`}
>
  {#each particles as particle (particle.id)}
    <i
      style={`--x:${particle.x}%; --y:${particle.y}%; --s:${particle.size}px; --d:${particle.duration}s; --depth:${particle.depth};`}
    ></i>
  {/each}
</div>

<style>
  .particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .particles i {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--s);
    height: var(--s);
    border-radius: 999px;
    background: var(--k-particle-color);
    box-shadow:
      0 0 calc(12px + 18px * var(--depth)) rgba(var(--k-runtime-tint-rgb), 0.22),
      0 0 18px var(--k-particle-glow, var(--k-frustum-light));
    opacity: calc(0.28 + var(--depth) * 0.38);
    animation: float var(--d) ease-in-out infinite alternate;
  }

  .particles[data-theme-mode='light'] i {
    box-shadow:
      0 0 calc(8px + 12px * var(--depth)) rgba(var(--k-runtime-tint-rgb), 0.12),
      0 0 12px var(--k-particle-glow);
    opacity: calc(0.2 + var(--depth) * 0.24);
  }

  .reducedMotion i {
    animation: none;
  }

  @keyframes float {
    from {
      filter: blur(0.2px);
      transform: translate3d(-8px, 6px, 0) scale(calc(0.8 + var(--depth)));
    }

    to {
      filter: blur(1.4px);
      transform: translate3d(10px, -14px, 0) scale(calc(0.95 + var(--depth)));
    }
  }
</style>
