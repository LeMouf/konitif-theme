import type { RuntimePhase } from '../konitifRuntimePhaseTokens';
import { normalizeKonitifRuntimePhase } from '../konitifRuntimePhaseTokens';
import type { SpatialProjectionGridConfig, SpatialProjectionGridPresetName } from './spatialProjectionGridTypes';

const defaultSpatialGridFrame = {
  vanishingPointX: 0.5,
  vanishingPointY: 0.47,
  horizonY: 0.51,
  originY: 0.82
} satisfies Pick<SpatialProjectionGridConfig, 'vanishingPointX' | 'vanishingPointY' | 'horizonY' | 'originY'>;

export const spatialProjectionGridPresets: Record<SpatialProjectionGridPresetName, SpatialProjectionGridConfig> = {
  calm: {
    enabled: true,
    ...defaultSpatialGridFrame,
    majorStep: 96,
    minorDivisions: 4,
    visibleDepth: 11,
    visibleWidth: 9,
    perspectiveTilt: 0.66,
    horizonFalloff: 0.78,
    lateralFalloff: 0.72,
    majorLineOpacity: 0.24,
    minorLineOpacity: 0.08,
    nodeOpacity: 0.28,
    originNodeOpacity: 0.76,
    glowIntensity: 0.32,
    fogIntensity: 0.34,
    animationSpeed: 0.08
  },
  focus: {
    enabled: true,
    ...defaultSpatialGridFrame,
    majorStep: 96,
    minorDivisions: 5,
    visibleDepth: 12,
    visibleWidth: 10,
    perspectiveTilt: 0.68,
    horizonFalloff: 0.72,
    lateralFalloff: 0.68,
    majorLineOpacity: 0.34,
    minorLineOpacity: 0.1,
    nodeOpacity: 0.38,
    originNodeOpacity: 0.88,
    glowIntensity: 0.46,
    fogIntensity: 0.32,
    animationSpeed: 0.1
  },
  runtime: {
    enabled: true,
    ...defaultSpatialGridFrame,
    majorStep: 92,
    minorDivisions: 5,
    visibleDepth: 13,
    visibleWidth: 11,
    perspectiveTilt: 0.7,
    horizonFalloff: 0.74,
    lateralFalloff: 0.7,
    majorLineOpacity: 0.3,
    minorLineOpacity: 0.1,
    nodeOpacity: 0.36,
    originNodeOpacity: 0.84,
    glowIntensity: 0.42,
    fogIntensity: 0.38,
    animationSpeed: 0.16
  },
  analysis: {
    enabled: true,
    ...defaultSpatialGridFrame,
    majorStep: 88,
    minorDivisions: 6,
    visibleDepth: 14,
    visibleWidth: 12,
    perspectiveTilt: 0.72,
    horizonFalloff: 0.7,
    lateralFalloff: 0.66,
    majorLineOpacity: 0.38,
    minorLineOpacity: 0.13,
    nodeOpacity: 0.42,
    originNodeOpacity: 0.9,
    glowIntensity: 0.48,
    fogIntensity: 0.36,
    animationSpeed: 0.18
  },
  recovery: {
    enabled: true,
    ...defaultSpatialGridFrame,
    majorStep: 100,
    minorDivisions: 4,
    visibleDepth: 10,
    visibleWidth: 9,
    perspectiveTilt: 0.65,
    horizonFalloff: 0.82,
    lateralFalloff: 0.74,
    majorLineOpacity: 0.28,
    minorLineOpacity: 0.07,
    nodeOpacity: 0.32,
    originNodeOpacity: 0.78,
    glowIntensity: 0.4,
    fogIntensity: 0.42,
    animationSpeed: 0.1
  },
  safeMode: {
    enabled: true,
    ...defaultSpatialGridFrame,
    majorStep: 112,
    minorDivisions: 2,
    visibleDepth: 8,
    visibleWidth: 7,
    perspectiveTilt: 0.62,
    horizonFalloff: 0.88,
    lateralFalloff: 0.82,
    majorLineOpacity: 0.18,
    minorLineOpacity: 0.04,
    nodeOpacity: 0.16,
    originNodeOpacity: 0.48,
    glowIntensity: 0.16,
    fogIntensity: 0.18,
    animationSpeed: 0.02
  }
};

export function getSpatialProjectionGridPresetForPhase(
  phase: RuntimePhase | string | null | undefined
): SpatialProjectionGridPresetName {
  const resolvedPhase = normalizeKonitifRuntimePhase(phase);

  switch (resolvedPhase) {
    case 'BOOT':
    case 'LAUNCH_GATE':
    case 'CONTEXT_RESOLVED':
    case 'SUSPENDING':
    case 'SUSPENDED':
      return 'calm';
    case 'PREFLIGHT':
      return 'analysis';
    case 'PLANNED':
      return 'focus';
    case 'INITIALIZING':
    case 'HYDRATING':
    case 'RUNNING':
    case 'RESUMING':
      return 'runtime';
    case 'TEARDOWN':
    case 'RECOVERY':
      return 'recovery';
    case 'SAFE_MODE':
      return 'safeMode';
    default:
      return 'calm';
  }
}
