<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { globalPerceptualFocusStore } from './perceptualFocusStore';
  import { setPerceptualFocusContext } from './usePerceptualFocus';
  import type { PerceptualFocusState, PerceptualFocusStore } from './perceptualFocusTypes';

  export let store: PerceptualFocusStore = globalPerceptualFocusStore;
  export let enabled = true;

  const dispatch = createEventDispatcher<{ focuschange: PerceptualFocusState }>();
  setPerceptualFocusContext(store);

  $: focusState = $store;
  $: dispatch('focuschange', focusState);
  $: focusStyle = [
    `--k-focus-x: ${focusState.focusPoint.x}`,
    `--k-focus-y: ${focusState.focusPoint.y}`,
    `--k-focus-strength: ${enabled ? focusState.focusStrength : 0}`
  ].join('; ');
</script>

<div
  class="konitif-focus-plane"
  data-workbench-focus-plane
  data-workbench-focus-enabled={enabled}
  data-workbench-active-surface={focusState.activeSurfaceId ?? undefined}
  data-workbench-active-role={focusState.activeRole ?? undefined}
  data-workbench-active-depth={focusState.activeDepth ?? undefined}
  data-konitif-focus-plane
  data-konitif-focus-enabled={enabled}
  data-konitif-active-surface={focusState.activeSurfaceId ?? undefined}
  data-konitif-active-role={focusState.activeRole ?? undefined}
  data-konitif-active-depth={focusState.activeDepth ?? undefined}
  style={focusStyle}
>
  <slot />
</div>

<style>
  .konitif-focus-plane {
    display: contents;
  }
</style>
