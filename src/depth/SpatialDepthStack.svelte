<script lang="ts">
  export let active = true;
  export let perspective = 1200;
</script>

<div
  class="konitif-depth-stack"
  data-konitif-depth-stack
  data-konitif-depth-active={active}
  style={`--k-depth-perspective: ${perspective}px;`}
>
  <slot />
</div>

<style>
  .konitif-depth-stack {
    position: relative;
    transform-style: preserve-3d;
    perspective: var(--k-depth-perspective);
  }

  .konitif-depth-stack[data-konitif-depth-active='false'] {
    perspective: none;
  }
</style>
