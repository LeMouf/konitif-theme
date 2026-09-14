<script context="module" lang="ts">
  let spatialProjectionGridInstanceSequence = 0;
</script>

<script lang="ts">
  import type { RuntimePhase } from '../konitifRuntimePhaseTokens';
  import type { AmbientQuality } from './spatialAmbientTypes';
  import {
    createSpatialProjectionGridGeometry,
    resolveSpatialProjectionGridConfig
  } from './spatialProjectionGridModel';
  import type { SpatialProjectionGridConfig } from './spatialProjectionGridTypes';

  export let config: Partial<SpatialProjectionGridConfig> | null = null;
  export let phase: RuntimePhase | string = 'LAUNCH_GATE';
  export let quality: AmbientQuality = 'medium';
  export let reducedMotion = false;
  export let animated = true;
  export let themeMode: 'dark' | 'light' = 'dark';

  const instanceId = `konitif-grid-${++spatialProjectionGridInstanceSequence}`;

  $: resolvedConfig = resolveSpatialProjectionGridConfig({ phase, quality, reducedMotion, config });
  $: renderConfig = resolveRenderConfig(resolvedConfig, themeMode);
  $: geometry = createSpatialProjectionGridGeometry(renderConfig);
  $: shouldRender = quality !== 'off' && renderConfig.enabled;
  $: shouldAnimate = animated && !reducedMotion && renderConfig.animationSpeed > 0;
  $: gridStyle = [
    `--k-space-grid-major-opacity: ${renderConfig.majorLineOpacity}`,
    `--k-space-grid-minor-opacity: ${renderConfig.minorLineOpacity}`,
    `--k-space-grid-node-opacity: ${renderConfig.nodeOpacity}`,
    `--k-space-grid-origin-opacity: ${renderConfig.originNodeOpacity}`,
    `--k-space-grid-glow: ${renderConfig.glowIntensity}`,
    `--k-space-grid-fog-opacity: ${renderConfig.fogIntensity}`,
    `--k-space-grid-drift-duration: ${Math.max(18, 54 - renderConfig.animationSpeed * 34)}s`
  ].join('; ');

  function resolveRenderConfig(
    currentConfig: SpatialProjectionGridConfig,
    mode: 'dark' | 'light'
  ): SpatialProjectionGridConfig {
    if (mode !== 'light') {
      return currentConfig;
    }

    return {
      ...currentConfig,
      majorLineOpacity: clamp01(currentConfig.majorLineOpacity * 1.14 + 0.025),
      minorLineOpacity: clamp01(currentConfig.minorLineOpacity * 0.56),
      nodeOpacity: clamp01(currentConfig.nodeOpacity * 1.08),
      originNodeOpacity: clamp01(currentConfig.originNodeOpacity * 1.12),
      glowIntensity: clamp01(currentConfig.glowIntensity * 0.58),
      fogIntensity: clamp01(currentConfig.fogIntensity * 0.72),
      animationSpeed: clamp01(currentConfig.animationSpeed * 0.72)
    };
  }

  function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
  }
</script>

{#if shouldRender}
  <div
    class:spatial-grid--animated={shouldAnimate}
    class="spatial-grid"
    data-quality={quality}
    data-phase={phase}
    data-theme-mode={themeMode}
    style={gridStyle}
    aria-hidden="true"
  >
    <div class="spatial-grid__fog"></div>
    <svg
      class="spatial-grid__svg"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      preserveAspectRatio="none"
      focusable="false"
      role="presentation"
    >
      <defs>
        <filter id={`${instanceId}-node-glow`} x="-160%" y="-160%" width="420%" height="420%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${instanceId}-depth-fade`} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="54%" stop-color="white" stop-opacity="0.52" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <radialGradient id={`${instanceId}-lateral-fade`} cx="50%" cy="76%" r="72%">
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="58%" stop-color="white" stop-opacity="0.74" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </radialGradient>
        <mask id={`${instanceId}-mask`}>
          <rect width={geometry.width} height={geometry.height} fill={`url(#${instanceId}-depth-fade)`} />
          <rect width={geometry.width} height={geometry.height} fill={`url(#${instanceId}-lateral-fade)`} opacity="0.82" />
        </mask>
      </defs>

      <g class="spatial-grid__layer" mask={`url(#${instanceId}-mask)`}>
        {#each geometry.lines as line (line.id)}
          <line
            class={`spatial-grid__line spatial-grid__line--${line.kind}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            opacity={line.opacity}
          />
        {/each}

        {#each geometry.nodes as node (node.id)}
          <circle
            class:spatial-grid__node--origin={node.origin}
            class="spatial-grid__node"
            cx={node.x}
            cy={node.y}
            r={node.radius}
            opacity={node.opacity}
            filter={`url(#${instanceId}-node-glow)`}
          />
        {/each}
      </g>
    </svg>
  </div>
{/if}

<style>
  .spatial-grid {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    opacity: var(--k-space-grid-opacity, 0.92);
    filter: blur(var(--k-space-grid-blur, 0px));
  }

  .spatial-grid::after {
    position: absolute;
    inset: 0;
    content: '';
    pointer-events: none;
    opacity: 0;
  }

  .spatial-grid__fog,
  .spatial-grid__svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .spatial-grid__fog {
    background:
      radial-gradient(ellipse at 50% 45%, var(--k-space-grid-horizon), transparent 28%),
      radial-gradient(ellipse at 50% 72%, var(--k-space-grid-fog), transparent 44%);
    opacity: var(--k-space-grid-fog-opacity, 0.32);
  }

  .spatial-grid[data-theme-mode='light'] .spatial-grid__fog {
    background:
      radial-gradient(ellipse at 72% 18%, rgba(255, 238, 205, 0.2), transparent 24%),
      radial-gradient(ellipse at 50% 48%, var(--k-space-grid-horizon), transparent 28%),
      radial-gradient(ellipse at 50% 72%, var(--k-space-grid-fog), transparent 48%);
  }

  .spatial-grid__svg {
    overflow: visible;
  }

  .spatial-grid__layer {
    transform-origin: 50% 82%;
  }

  .spatial-grid--animated .spatial-grid__layer {
    animation: konitif-grid-drift var(--k-space-grid-drift-duration, 42s) ease-in-out infinite alternate;
  }

  .spatial-grid__line {
    vector-effect: non-scaling-stroke;
    stroke-linecap: round;
    mix-blend-mode: screen;
  }

  .spatial-grid[data-theme-mode='light'] .spatial-grid__line {
    mix-blend-mode: multiply;
  }

  .spatial-grid__line--axis {
    stroke: var(--k-space-grid-axis);
    stroke-width: 1.25;
  }

  .spatial-grid__line--major {
    stroke: var(--k-space-grid-major);
    stroke-width: 0.9;
  }

  .spatial-grid__line--minor {
    stroke: var(--k-space-grid-minor);
    stroke-width: 0.56;
  }

  .spatial-grid__line--tertiary {
    stroke: var(--k-space-grid-tertiary);
    stroke-width: 0.42;
  }

  .spatial-grid__node {
    fill: var(--k-space-grid-node);
    mix-blend-mode: screen;
  }

  .spatial-grid[data-theme-mode='light'] .spatial-grid__node {
    mix-blend-mode: normal;
  }

  .spatial-grid__node--origin {
    fill: var(--k-space-grid-origin);
  }

  .spatial-grid[data-theme-mode='light']::after {
    background:
      radial-gradient(circle at 50% 82%, rgba(75, 135, 190, 0.08), transparent 22%),
      linear-gradient(35deg, rgba(110, 135, 165, 0.12) 0%, transparent 34%),
      linear-gradient(160deg, rgba(255, 238, 205, 0.12) 0%, transparent 28%);
    mix-blend-mode: multiply;
    opacity: 1;
  }

  @keyframes konitif-grid-drift {
    from {
      transform: translate3d(0, 3px, 0);
    }

    to {
      transform: translate3d(0, -5px, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spatial-grid--animated .spatial-grid__layer {
      animation: none;
    }
  }
</style>
