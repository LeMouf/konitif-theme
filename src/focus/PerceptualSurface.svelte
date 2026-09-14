<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { konitifRoleDefaultDepth, resolveKonitifDepthVisual } from './focusDepthMap';
  import { usePerceptualFocus } from './usePerceptualFocus';
  import type { KonitifDepthLevel, KonitifSurfaceRole } from './perceptualFocusTypes';

  export let id: string;
  export let role: KonitifSurfaceRole = 'panel';
  export let depth: KonitifDepthLevel | null = null;
  export let active = false;
  export let focusStrength = 1;
  export let interactive = true;
  export let as: keyof HTMLElementTagNameMap = 'div';
  export let ariaRole: string | null = 'group';
  let className = '';
  export { className as class };

  const focus = usePerceptualFocus();

  $: resolvedDepth = depth ?? konitifRoleDefaultDepth[role];
  $: depthVisual = resolveKonitifDepthVisual(resolvedDepth);
  $: surfaceStyle = [
    `--k-surface-z: ${depthVisual.zIndex}`,
    `--k-surface-blur: ${depthVisual.blur}px`,
    `--k-surface-opacity: ${depthVisual.opacity}`,
    `--k-surface-contrast: ${depthVisual.contrast}`,
    `--k-surface-shadow: ${depthVisual.shadow}`,
    `--k-surface-parallax: ${depthVisual.parallax}`,
    `--k-surface-light-response: ${depthVisual.lightResponse}`
  ].join('; ');

  function getPoint(event?: MouseEvent | PointerEvent | FocusEvent): PerceptualFocusPoint {
    if (!event || !('currentTarget' in event)) {
      return { x: 0.5, y: 0.42 };
    }

    const element = event.currentTarget as HTMLElement | null;
    const rect = element?.getBoundingClientRect();

    if (!rect || rect.width <= 0 || rect.height <= 0) {
      return { x: 0.5, y: 0.42 };
    }

    const clientX = 'clientX' in event ? event.clientX : rect.left + rect.width / 2;
    const clientY = 'clientY' in event ? event.clientY : rect.top + rect.height / 2;

    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    };
  }

  function activate(event?: MouseEvent | FocusEvent): void {
    if (!interactive) {
      return;
    }

    focus.setActiveSurface({
      id,
      role,
      depth: resolvedDepth,
      focusPoint: getPoint(event),
      focusStrength
    });
  }

  onMount(() => {
    focus.registerSurface({ id, role, depth: resolvedDepth });
  });

  onDestroy(() => {
    focus.unregisterSurface(id);
  });

  $: if (active) {
    focus.setActiveSurface({ id, role, depth: resolvedDepth, focusStrength });
  }
</script>

<svelte:element
  this={as}
  {...$$restProps}
  class={`konitif-perceptual-surface workbench-perceptual-surface ${className}`.trim()}
  data-workbench-surface-frame={id}
  data-workbench-surface-role={role}
  data-workbench-surface-depth={resolvedDepth}
  data-workbench-surface-active={active || $focus.activeSurfaceId === id ? 'true' : undefined}
  data-workbench-theme-active={active || $focus.activeSurfaceId === id ? 'true' : undefined}
  data-konitif-surface={id}
  data-konitif-surface-role={role}
  data-konitif-surface-depth={resolvedDepth}
  data-konitif-active={active || $focus.activeSurfaceId === id ? 'true' : undefined}
  role={interactive ? (ariaRole ?? undefined) : undefined}
  style={`${surfaceStyle}; ${$$restProps.style ?? ''}`}
  on:mouseenter={activate}
  on:focusin={activate}
  on:click={activate}
>
  <slot />
</svelte:element>

<style>
  .konitif-perceptual-surface {
    position: relative;
    z-index: var(--k-surface-z);
    opacity: var(--k-surface-opacity);
    filter: blur(var(--k-surface-blur)) contrast(var(--k-surface-contrast));
    transition:
      box-shadow 280ms ease,
      filter 320ms ease,
      opacity 320ms ease;
  }

  .konitif-perceptual-surface::after {
    content: '';
    position: absolute;
    inset: -1px;
    border: 1px solid transparent;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition:
      opacity 220ms ease,
      box-shadow 260ms ease;
  }

  .konitif-perceptual-surface[data-konitif-active='true'] {
    opacity: 1;
    filter: none;
  }

  .konitif-perceptual-surface[data-konitif-active='true']::after {
    border-color: var(--k-border-soft);
    box-shadow:
      0 0 calc(1.6rem * var(--k-surface-light-response)) rgba(var(--k-runtime-tint-rgb, 34, 211, 238), 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.04);
    opacity: calc(0.34 + var(--k-focus-strength, 0) * 0.44);
  }

  @media (prefers-reduced-motion: reduce) {
    .konitif-perceptual-surface {
      transform: none;
      transition-duration: 1ms;
    }
  }
</style>
