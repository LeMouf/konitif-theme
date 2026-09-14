import type { ComponentType, SvelteComponent } from 'svelte';
import SpatialAmbientRuntime from './ambient/SpatialAmbientRuntime.svelte';
import FocusPlaneProvider from './focus/FocusPlaneProvider.svelte';
import PerceptualSurface from './focus/PerceptualSurface.svelte';
import { applyKonitifTheme } from './konitifThemeAdapter';
import type { KonitifThemeMode } from './konitifTheme';

export type KonitifWorkbenchThemeColorMode = 'dark' | 'light';
export type KonitifWorkbenchThemeComponent = ComponentType<SvelteComponent>;

export interface KonitifWorkbenchThemeRuntime {
  themeFamily: string;
  AmbientRuntime: KonitifWorkbenchThemeComponent;
  FocusPlaneProvider: KonitifWorkbenchThemeComponent;
  SurfaceFrame: KonitifWorkbenchThemeComponent;
  applyTheme: (themeId: string, colorMode: KonitifWorkbenchThemeColorMode) => void;
  resolveThemeModeId: (colorMode: KonitifWorkbenchThemeColorMode) => string;
}

export const konitifWorkbenchThemeRuntime: KonitifWorkbenchThemeRuntime = {
  themeFamily: 'konitif',
  AmbientRuntime: SpatialAmbientRuntime,
  FocusPlaneProvider,
  SurfaceFrame: PerceptualSurface,
  applyTheme: (themeId) => applyKonitifTheme(resolveKonitifThemeMode(themeId)),
  resolveThemeModeId: resolveKonitifWorkbenchThemeModeId
};

export function resolveKonitifWorkbenchThemeModeId(colorMode: KonitifWorkbenchThemeColorMode): KonitifThemeMode {
  return colorMode === 'light' ? 'konitif-light' : 'konitif-dark';
}

function resolveKonitifThemeMode(themeId: string): KonitifThemeMode {
  return themeId === 'konitif-light' ? 'konitif-light' : 'konitif-dark';
}
