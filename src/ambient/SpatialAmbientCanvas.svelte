<script lang="ts">
  import { onMount } from 'svelte';
  import type { RuntimePhase } from '../konitifRuntimePhaseTokens';
  import type { RuntimeSpatialState } from '../runtime/runtimeSpatialReactivity';
  import type { AmbientQuality } from './spatialAmbientTypes';

  export let phase: RuntimePhase = 'LAUNCH_GATE';
  export let quality: AmbientQuality = 'medium';
  export let reducedMotion = false;
  export let spatialState: RuntimeSpatialState | null = null;
  export let themeMode: 'dark' | 'light' = 'dark';

  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let mounted = false;
  let drawFrame = 0;

  $: if (mounted) {
    phase;
    quality;
    reducedMotion;
    spatialState;
    themeMode;
    scheduleDraw();
  }

  onMount(() => {
    context = canvas?.getContext('2d') ?? null;

    if (!canvas || !context) {
      return;
    }

    mounted = true;
    const resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(() => {
            scheduleDraw();
          })
        : null;

    resizeObserver?.observe(canvas);
    scheduleDraw();

    return () => {
      mounted = false;
      resizeObserver?.disconnect();

      if (drawFrame !== 0) {
        cancelAnimationFrame(drawFrame);
        drawFrame = 0;
      }

      context = null;
    };
  });

  function scheduleDraw(): void {
    if (!mounted || drawFrame !== 0 || typeof requestAnimationFrame !== 'function') {
      return;
    }

    drawFrame = requestAnimationFrame(() => {
      drawFrame = 0;
      drawAmbientCanvas();
    });
  }

  function drawAmbientCanvas(): void {
    if (!canvas || !context) {
      return;
    }

    const dpr = Math.min(devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    const style = getComputedStyle(canvas);
    const isLight = themeMode === 'light';
    const tintRgb = spatialState?.tintRgb ?? (style.getPropertyValue('--k-runtime-tint-rgb').trim() || '34, 211, 238');
    const intensity = spatialState?.lightIntensity ?? (Number.parseFloat(style.getPropertyValue('--k-runtime-intensity')) || 0.5);
    const fogDensity = spatialState?.fogDensity ?? (Number.parseFloat(style.getPropertyValue('--k-runtime-fog-density')) || 0.24);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * (isLight ? 0.44 : 0.38);
    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(width, height) * 0.72
    );

    gradient.addColorStop(0, `rgba(${tintRgb}, ${isLight ? 0.06 * intensity + 0.025 * fogDensity : 0.18 * intensity + 0.05 * fogDensity})`);
    gradient.addColorStop(0.38, `rgba(${tintRgb}, ${isLight ? 0.025 * intensity + 0.018 * fogDensity : 0.06 * intensity + 0.035 * fogDensity})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (isLight) {
      const warmLight = context.createRadialGradient(
        width * 0.76,
        height * 0.12,
        0,
        width * 0.76,
        height * 0.12,
        Math.max(width, height) * 0.48
      );
      warmLight.addColorStop(0, `rgba(255, 236, 198, ${0.12 + intensity * 0.05})`);
      warmLight.addColorStop(0.42, `rgba(255, 236, 198, ${0.045 + intensity * 0.025})`);
      warmLight.addColorStop(1, 'rgba(255, 236, 198, 0)');
      context.fillStyle = warmLight;
      context.fillRect(0, 0, width, height);

      const coldEdge = context.createLinearGradient(0, height, width * 0.55, height * 0.28);
      coldEdge.addColorStop(0, `rgba(110, 135, 165, ${0.095 + fogDensity * 0.025})`);
      coldEdge.addColorStop(0.42, 'rgba(110, 135, 165, 0.035)');
      coldEdge.addColorStop(1, 'rgba(110, 135, 165, 0)');
      context.fillStyle = coldEdge;
      context.fillRect(0, 0, width, height);
    }
  }
</script>

<canvas bind:this={canvas} class="ambient-canvas" data-phase={phase} data-quality={quality} data-theme-mode={themeMode}></canvas>

<style>
  .ambient-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    filter: blur(0.2px);
    opacity: 0.95;
  }

  .ambient-canvas[data-theme-mode='light'] {
    filter: blur(0.1px);
    opacity: 0.72;
  }
</style>
