import type { RuntimePhase } from '../konitifRuntimePhaseTokens';
import type { AmbientQuality } from './spatialAmbientTypes';

export type SpatialProjectionGridPresetName =
  | 'calm'
  | 'focus'
  | 'runtime'
  | 'analysis'
  | 'recovery'
  | 'safeMode';

export type SpatialProjectionGridConfig = {
  enabled: boolean;
  majorStep: number;
  minorDivisions: number;
  visibleDepth: number;
  visibleWidth: number;
  vanishingPointX: number;
  vanishingPointY: number;
  horizonY: number;
  originY: number;
  perspectiveTilt: number;
  horizonFalloff: number;
  lateralFalloff: number;
  majorLineOpacity: number;
  minorLineOpacity: number;
  nodeOpacity: number;
  originNodeOpacity: number;
  glowIntensity: number;
  fogIntensity: number;
  animationSpeed: number;
};

export type SpatialProjectionGridResolveOptions = {
  phase?: RuntimePhase | string | null;
  quality?: AmbientQuality;
  reducedMotion?: boolean;
  config?: Partial<SpatialProjectionGridConfig> | null;
};

export type SpatialProjectionGridLineKind = 'major' | 'minor' | 'tertiary' | 'axis';

export type SpatialProjectionGridLine = {
  id: string;
  kind: SpatialProjectionGridLineKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
};

export type SpatialProjectionGridNode = {
  id: string;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  origin?: boolean;
};

export type SpatialProjectionGridGeometry = {
  width: number;
  height: number;
  horizonY: number;
  originX: number;
  originY: number;
  vanishingPointX: number;
  vanishingPointY: number;
  lines: SpatialProjectionGridLine[];
  nodes: SpatialProjectionGridNode[];
};
