<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { StageAmbientProjection } from '@konitif/workbench';
  import { globalPerceptualFocusStore } from '../focus/perceptualFocusStore';
  import { normalizeKonitifRuntimePhase, type RuntimePhase } from '../konitifRuntimePhaseTokens';
  import {
    createRuntimeSpatialState,
    interpolateRuntimeSpatialState,
    type RuntimeSpatialState
  } from '../runtime/runtimeSpatialReactivity';
  import SpatialAmbientCanvas from './SpatialAmbientCanvas.svelte';
  import SpatialAmbientParticles from './SpatialAmbientParticles.svelte';
  import SpatialProjectionGrid from './SpatialProjectionGrid.svelte';
  import type { AmbientQuality } from './spatialAmbientTypes';
  import type { SpatialProjectionGridConfig } from './spatialProjectionGridTypes';

  export let phase: RuntimePhase = 'LAUNCH_GATE';
  export let quality: AmbientQuality = 'medium';
  export let reducedMotion = false;
  export let themeMode: 'dark' | 'light' = 'dark';
  export let spatialOverrides: Partial<RuntimeSpatialState> | null = null;
  export let gridConfig: Partial<SpatialProjectionGridConfig> | null = null;
  export let stageAmbient: StageAmbientProjection | null = null;

  let prefersReducedMotion = false;
  let isDocumentHidden = false;
  let reducedMotionQuery: MediaQueryList | null = null;
  let focusState = globalPerceptualFocusStore.getState();
  let renderedPhase: RuntimePhase | null = null;
  let renderedSpatialState: RuntimeSpatialState | null = null;
  let vectorTransitionTarget: RuntimePhase | null = null;
  let vectorTransitionFrame: number | null = null;
  let vectorTransitionStartedAt = 0;

  const phaseVectorFadeDuration = 680;

  $: resolvedPhase = normalizeKonitifRuntimePhase(phase);
  $: effectiveReducedMotion = reducedMotion || prefersReducedMotion || isDocumentHidden;
  $: targetSpatialState = {
    ...createRuntimeSpatialState(resolvedPhase, {
      quality,
      reducedMotion: reducedMotion || prefersReducedMotion,
      hidden: isDocumentHidden
    }),
    ...(spatialOverrides ?? {}),
    phase: resolvedPhase
  };
  $: activeSpatialState = renderedSpatialState ?? targetSpatialState;
  $: ambientStyle = createAmbientStyle(activeSpatialState);
  $: if (quality !== 'off') {
    syncRuntimeVector(resolvedPhase, targetSpatialState, effectiveReducedMotion);
  } else {
    clearVectorTransition();
    renderedPhase = null;
    renderedSpatialState = null;
    vectorTransitionTarget = null;
  }

  onMount(() => {
    const unsubscribeFocus = globalPerceptualFocusStore.subscribe((state) => {
      focusState = state;
    });

    if (typeof document !== 'undefined') {
      isDocumentHidden = document.hidden;
      const handleVisibilityChange = (): void => {
        isDocumentHidden = document.hidden;
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          unsubscribeFocus();
        };
      }

      reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion = reducedMotionQuery.matches;

      const handleChange = (event: MediaQueryListEvent): void => {
        prefersReducedMotion = event.matches;
      };

      reducedMotionQuery.addEventListener('change', handleChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        reducedMotionQuery?.removeEventListener('change', handleChange);
        unsubscribeFocus();
      };
    }

    return unsubscribeFocus;
  });

  onDestroy(() => {
    clearVectorTransition();
    reducedMotionQuery = null;
  });

  function createAmbientStyle(state: RuntimeSpatialState): string {
    const focusPoint = stageAmbient?.focusPoint ?? focusState.focusPoint;
    const focusStrength = stageAmbient
      ? Math.max(0.2, 1 - stageAmbient.focusDepth * 0.42)
      : focusState.focusStrength;

    return [
      `--k-runtime-tint: ${state.tint}`,
      `--k-runtime-tint-rgb: ${state.tintRgb}`,
      `--k-runtime-intensity: ${state.lightIntensity}`,
      `--k-runtime-fog-density: ${state.fogDensity}`,
      `--k-runtime-particle-density: ${state.particleDensity}`,
      `--k-runtime-particle-speed: ${state.particleSpeed}`,
      `--k-runtime-motion-intensity: ${state.motionIntensity}`,
      `--k-runtime-tilt-strength: ${state.tiltStrength}`,
      `--k-runtime-focus-falloff: ${state.focusFalloff}`,
      `--k-runtime-instability: ${state.instability}`,
      `--k-focus-x: ${focusPoint.x}`,
      `--k-focus-y: ${focusPoint.y}`,
      `--k-focus-strength: ${focusStrength}`
    ].join('; ');
  }

  function syncRuntimeVector(
    phaseValue: RuntimePhase,
    state: RuntimeSpatialState,
    shouldReduceMotion: boolean
  ): void {
    if (typeof window === 'undefined' || shouldReduceMotion || renderedSpatialState === null || renderedPhase === null) {
      clearVectorTransition();
      renderedPhase = phaseValue;
      renderedSpatialState = { ...state };
      vectorTransitionTarget = null;
      return;
    }

    if (phaseValue === renderedPhase) {
      if (vectorTransitionTarget === null) {
        renderedSpatialState = { ...state };
      }
      return;
    }

    if (phaseValue === vectorTransitionTarget) {
      return;
    }

    startVectorTransition(renderedSpatialState, { ...state }, phaseValue);
  }

  function startVectorTransition(fromState: RuntimeSpatialState, toState: RuntimeSpatialState, targetPhase: RuntimePhase): void {
    if (typeof window === 'undefined') {
      renderedPhase = targetPhase;
      renderedSpatialState = { ...toState };
      vectorTransitionTarget = null;
      return;
    }

    clearVectorTransition();
    vectorTransitionTarget = targetPhase;
    vectorTransitionStartedAt = window.performance.now();

    const step = (now: number): void => {
      const progress = (now - vectorTransitionStartedAt) / phaseVectorFadeDuration;
      renderedSpatialState = interpolateRuntimeSpatialState(fromState, toState, progress);

      if (progress < 1) {
        vectorTransitionFrame = window.requestAnimationFrame(step);
        return;
      }

      renderedPhase = targetPhase;
      renderedSpatialState = { ...toState };
      vectorTransitionTarget = null;
      vectorTransitionFrame = null;
    };

    vectorTransitionFrame = window.requestAnimationFrame(step);
  }

  function clearVectorTransition(): void {
    if (typeof window !== 'undefined' && vectorTransitionFrame !== null) {
      window.cancelAnimationFrame(vectorTransitionFrame);
    }
    vectorTransitionFrame = null;
  }
</script>

{#if quality !== 'off' && activeSpatialState}
  <div
    class="konitif-ambient workbench-theme-ambient"
    data-workbench-theme-ambient
    data-workbench-theme-family="konitif"
    data-quality={quality}
    data-theme-mode={themeMode}
    aria-hidden="true"
  >
    <div
      class="konitif-ambient__phase-layer"
      style={ambientStyle}
      data-phase={activeSpatialState.phase}
      data-reduced-motion={effectiveReducedMotion}
    >
      <SpatialAmbientCanvas
        phase={activeSpatialState.phase}
        {quality}
        reducedMotion={effectiveReducedMotion}
        spatialState={activeSpatialState}
        {themeMode}
      />
      <SpatialProjectionGrid
        phase={activeSpatialState.phase}
        {quality}
        reducedMotion={effectiveReducedMotion}
        config={gridConfig}
        {themeMode}
      />
      <SpatialAmbientParticles
        phase={activeSpatialState.phase}
        {quality}
        reducedMotion={effectiveReducedMotion}
        spatialState={activeSpatialState}
        {themeMode}
      />
      <div class="konitif-frustum-vignette"></div>
      <div class="konitif-corner-tilt"></div>
    </div>
  </div>
{/if}

<style>
  .konitif-ambient {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    background: var(--k-bg-root);
  }

  .konitif-ambient__phase-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    background:
      radial-gradient(circle at 50% 35%, rgba(var(--k-runtime-tint-rgb), calc(var(--k-runtime-intensity) * 0.34)), transparent 34%),
      radial-gradient(circle at 12% 18%, var(--k-frustum-light), transparent 28%),
      linear-gradient(180deg, var(--k-bg-space, var(--k-bg-root)), var(--k-bg-space-deep, var(--k-bg-root)));
  }

  .konitif-ambient[data-theme-mode='light'] .konitif-ambient__phase-layer {
    background:
      radial-gradient(circle at 68% 16%, var(--k-frustum-light-core), transparent 18%),
      radial-gradient(circle at 50% 44%, rgba(var(--k-runtime-tint-rgb), calc(var(--k-runtime-intensity) * 0.085)), transparent 30%),
      radial-gradient(ellipse at 50% 56%, var(--k-frustum-fog), transparent 44%),
      linear-gradient(135deg, rgba(255, 246, 230, 0.26) 0%, transparent 32%),
      linear-gradient(315deg, var(--k-frustum-shadow) 0%, transparent 30%),
      linear-gradient(180deg, var(--k-bg-space), var(--k-bg-space-deep));
  }

  .konitif-frustum-vignette,
  .konitif-corner-tilt {
    position: absolute;
    inset: 0;
  }

  .konitif-frustum-vignette {
    background:
      radial-gradient(circle at 50% 42%, transparent 0%, transparent 42%, rgba(0, 0, 0, calc(0.18 + var(--k-runtime-fog-density) * 0.18)) 100%),
      linear-gradient(115deg, transparent 0%, rgba(var(--k-runtime-tint-rgb), 0.035) 48%, transparent 68%);
    mix-blend-mode: multiply;
  }

  .konitif-ambient[data-theme-mode='light'] .konitif-frustum-vignette {
    background:
      radial-gradient(circle at 50% 42%, transparent 0%, transparent 54%, rgba(110, 135, 165, calc(0.08 + var(--k-runtime-fog-density) * 0.08)) 100%),
      linear-gradient(35deg, rgba(110, 135, 165, 0.08) 0%, transparent 38%),
      linear-gradient(120deg, transparent 0%, rgba(var(--k-runtime-tint-rgb), 0.026) 48%, transparent 72%);
    mix-blend-mode: multiply;
  }

  .konitif-corner-tilt {
    inset: -8%;
    background:
      linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.035) 48%, transparent 64%),
      linear-gradient(315deg, transparent 0%, rgba(var(--k-runtime-tint-rgb), 0.045) 52%, transparent 72%);
    opacity: 0.72;
  }

  .konitif-ambient[data-theme-mode='light'] .konitif-corner-tilt {
    background:
      linear-gradient(135deg, rgba(255, 238, 205, 0.14) 0%, transparent 38%),
      linear-gradient(315deg, rgba(110, 135, 165, 0.1) 0%, transparent 34%);
    opacity: 0.58;
  }

  @media (prefers-reduced-motion: reduce) {
    .konitif-corner-tilt {
      animation: none;
      transform: none;
    }
  }
</style>
