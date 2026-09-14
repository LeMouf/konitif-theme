import type { KonitifDepthLevel } from '../focus/perceptualFocusTypes';

export type SpatialDepthLayerDefinition = {
  depth: KonitifDepthLevel;
  label: string;
  blur: number;
  opacity: number;
  contrast: number;
  shadow: number;
  parallax: number;
  lightResponse: number;
};

export const spatialDepthLayers: SpatialDepthLayerDefinition[] = [
  {
    depth: 'ambient',
    label: 'Ambient',
    blur: 1.8,
    opacity: 0.64,
    contrast: 0.88,
    shadow: 0.04,
    parallax: 0,
    lightResponse: 0.22
  },
  {
    depth: 'background',
    label: 'Background',
    blur: 1.1,
    opacity: 0.74,
    contrast: 0.92,
    shadow: 0.08,
    parallax: 0,
    lightResponse: 0.34
  },
  {
    depth: 'workspace',
    label: 'Workspace',
    blur: 0.36,
    opacity: 0.92,
    contrast: 0.98,
    shadow: 0.14,
    parallax: 0,
    lightResponse: 0.5
  },
  {
    depth: 'panel',
    label: 'Panel',
    blur: 0.12,
    opacity: 0.98,
    contrast: 1,
    shadow: 0.2,
    parallax: 0,
    lightResponse: 0.64
  },
  {
    depth: 'active',
    label: 'Active',
    blur: 0,
    opacity: 1,
    contrast: 1.04,
    shadow: 0.32,
    parallax: 0,
    lightResponse: 0.82
  },
  {
    depth: 'overlay',
    label: 'Overlay',
    blur: 0,
    opacity: 1,
    contrast: 1.02,
    shadow: 0.4,
    parallax: 0,
    lightResponse: 0.92
  }
];

export function getSpatialDepthLayer(depth: KonitifDepthLevel): SpatialDepthLayerDefinition {
  return spatialDepthLayers.find((layer) => layer.depth === depth) ?? spatialDepthLayers[2];
}
