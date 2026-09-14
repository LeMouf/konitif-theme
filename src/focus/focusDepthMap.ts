import type { KonitifDepthLevel, KonitifSurfaceRole } from './perceptualFocusTypes';

export type KonitifDepthVisual = {
  zIndex: number;
  blur: number;
  opacity: number;
  contrast: number;
  shadow: number;
  parallax: number;
  lightResponse: number;
};

export const konitifDepthVisualMap = {
  ambient: { zIndex: 0, blur: 1.8, opacity: 0.64, contrast: 0.88, shadow: 0.04, parallax: -0.06, lightResponse: 0.22 },
  background: { zIndex: 1, blur: 1.1, opacity: 0.74, contrast: 0.92, shadow: 0.08, parallax: -0.03, lightResponse: 0.34 },
  workspace: { zIndex: 2, blur: 0.36, opacity: 0.92, contrast: 0.98, shadow: 0.14, parallax: 0, lightResponse: 0.5 },
  panel: { zIndex: 3, blur: 0.12, opacity: 0.98, contrast: 1, shadow: 0.2, parallax: 0.035, lightResponse: 0.64 },
  active: { zIndex: 4, blur: 0, opacity: 1, contrast: 1.04, shadow: 0.32, parallax: 0.06, lightResponse: 0.82 },
  overlay: { zIndex: 5, blur: 0, opacity: 1, contrast: 1.02, shadow: 0.4, parallax: 0.08, lightResponse: 0.92 }
} satisfies Record<KonitifDepthLevel, KonitifDepthVisual>;

export const konitifRoleDefaultDepth = {
  shell: 'workspace',
  panel: 'panel',
  tool: 'workspace',
  overlay: 'overlay',
  inspector: 'active',
  modal: 'overlay'
} satisfies Record<KonitifSurfaceRole, KonitifDepthLevel>;

export function resolveKonitifDepthVisual(depth: KonitifDepthLevel): KonitifDepthVisual {
  return konitifDepthVisualMap[depth] ?? konitifDepthVisualMap.workspace;
}
