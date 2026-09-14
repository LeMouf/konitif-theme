<script lang="ts">
  import { getSpatialDepthLayer } from './spatialDepthTypes';
  import type { KonitifDepthLevel } from '../focus/perceptualFocusTypes';

  export let depth: KonitifDepthLevel = 'workspace';
  export let active = false;
  export let parallax = true;

  $: layer = getSpatialDepthLayer(depth);
  $: layerStyle = [
    `--k-depth-layer-z: ${layer.parallax * 120}px`,
    `--k-depth-layer-parallax: ${parallax ? layer.parallax : 0}`,
    `--k-depth-layer-light-response: ${layer.lightResponse}`
  ].join('; ');
</script>

<div
  class="konitif-depth-layer"
  data-depth={depth}
  data-active={active}
  style={layerStyle}
>
  <slot />
</div>

<style>
  .konitif-depth-layer {
    position: relative;
    opacity: var(--k-depth-layer-opacity, 1);
    filter: blur(var(--k-depth-layer-blur, 0)) contrast(var(--k-depth-layer-contrast, 1));
    box-shadow: var(--k-depth-layer-shadow, none);
    transition:
      filter 360ms ease,
      opacity 360ms ease,
      box-shadow 420ms ease;
  }

  .konitif-depth-layer[data-active='true'] {
    opacity: 1;
    filter: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .konitif-depth-layer {
      transform: none;
      transition-duration: 1ms;
    }
  }
</style>
