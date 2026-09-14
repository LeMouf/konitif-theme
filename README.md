# @konitif/theme

Theme tokens, spatial ambience and perceptual focus projections for compatible
KONITIF Workbench hosts.

## Installation

```sh
npm install @konitif/theme
```

## What it provides

- Authored light and dark theme tokens.
- Svelte surfaces for ambient depth, focus and spatial presentation.
- Deterministic mappings from runtime phases to visual states.
- Explicit CSS entry points for base and depth tokens.

## Authority boundary

This package owns the KONITIF visual identity and its local projection state.
The host owns workspace state, runtime phases and semantic selection. Applying
or animating a theme never changes those authorities.

## Quick start

```ts
import {
  applyKonitifTheme,
  konitifWorkbenchThemeRuntime
} from '@konitif/theme';
import '@konitif/theme/styles.css';
import '@konitif/theme/depth/styles.css';

applyKonitifTheme('konitif-dark');
export const themeRuntime = konitifWorkbenchThemeRuntime;
```

## Public entry points

| Entry | Purpose |
| --- | --- |
| `@konitif/theme` | Theme identity, visual mappings and Svelte projection components. |
| `@konitif/theme/styles.css` | Base KONITIF design tokens. |
| `@konitif/theme/depth/styles.css` | Spatial depth tokens and layer styles. |

## Reference

See [`reference/`](reference/) for the machine-readable capability catalog and
authority diagram. These artifacts describe the package and do not configure a
host.

## License

Source-available under [PolyForm Noncommercial 1.0.0](LICENSE.md), not OSI open
source. Commercial use requires separate written authorization.
