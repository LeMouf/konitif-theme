<script lang="ts">export let active=false;</script>
<div class:active class="konitif-glass"><slot /></div>
<style>.konitif-glass{border:1px solid var(--k-border-soft);background:var(--k-bg-surface);backdrop-filter:blur(18px) saturate(1.25);box-shadow:0 24px 80px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.06);border-radius:18px}.konitif-glass.active{box-shadow:0 0 0 1px var(--k-glow-primary),0 28px 90px rgba(0,0,0,.26),0 0 48px var(--k-glow-primary)}</style>
