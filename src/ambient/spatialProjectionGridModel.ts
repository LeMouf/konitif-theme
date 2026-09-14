import type { AmbientQuality } from './spatialAmbientTypes';
import {
  getSpatialProjectionGridPresetForPhase,
  spatialProjectionGridPresets
} from './spatialProjectionGridPresets';
import type {
  SpatialProjectionGridConfig,
  SpatialProjectionGridGeometry,
  SpatialProjectionGridLine,
  SpatialProjectionGridLineKind,
  SpatialProjectionGridNode,
  SpatialProjectionGridResolveOptions
} from './spatialProjectionGridTypes';

const viewWidth = 1000;
const viewHeight = 1000;

type SpatialProjectionFrame = {
  originX: number;
  originY: number;
  horizonX: number;
  horizonY: number;
  vanishingPointX: number;
  vanishingPointY: number;
};

export function resolveSpatialProjectionGridConfig(
  options: SpatialProjectionGridResolveOptions = {}
): SpatialProjectionGridConfig {
  const presetName = getSpatialProjectionGridPresetForPhase(options.phase);
  const preset = spatialProjectionGridPresets[presetName];
  const quality = options.quality ?? 'medium';
  const qualityConfig = resolveQualityConfig(preset, quality);
  const reducedMotionConfig = options.reducedMotion
    ? { ...qualityConfig, animationSpeed: 0 }
    : qualityConfig;

  return clampGridConfig({
    ...reducedMotionConfig,
    ...(options.config ?? {})
  });
}

export function createSpatialProjectionGridGeometry(
  config: SpatialProjectionGridConfig
): SpatialProjectionGridGeometry {
  const frame = createProjectionFrame(config);

  if (!config.enabled) {
    return {
      width: viewWidth,
      height: viewHeight,
      horizonY: frame.horizonY,
      originX: frame.originX,
      originY: frame.originY,
      vanishingPointX: frame.vanishingPointX,
      vanishingPointY: frame.vanishingPointY,
      lines: [],
      nodes: []
    };
  }

  const lines: SpatialProjectionGridLine[] = [];
  const nodes: SpatialProjectionGridNode[] = [];
  const minorSteps = Math.max(1, Math.round(config.visibleDepth * config.minorDivisions));
  const depthLines = minorSteps + 1;

  for (let depthIndex = 0; depthIndex < depthLines; depthIndex += 1) {
    const depthRatio = depthIndex / minorSteps;
    const y = projectDepthY(depthRatio, config.perspectiveTilt, frame);
    const widthFactor = projectWidthFactor(depthRatio, config.perspectiveTilt);
    const halfWidth = config.visibleWidth * config.majorStep * widthFactor;
    const kind = depthIndex % config.minorDivisions === 0 ? 'major' : depthIndex % 2 === 0 ? 'minor' : 'tertiary';
    const opacity = resolveLineOpacity(kind, depthRatio, 0, config);

    lines.push({
      id: `depth-${depthIndex}`,
      kind,
      x1: frame.originX - halfWidth,
      y1: y,
      x2: frame.originX + halfWidth,
      y2: y,
      opacity
    });
  }

  for (let widthIndex = -config.visibleWidth; widthIndex <= config.visibleWidth; widthIndex += 1) {
    const lateralRatio = Math.abs(widthIndex) / Math.max(1, config.visibleWidth);
    const kind: SpatialProjectionGridLineKind = widthIndex === 0 ? 'axis' : 'major';
    const bottomX = frame.originX + widthIndex * config.majorStep;
    const horizonX = frame.horizonX + widthIndex * config.majorStep * 0.05;

    lines.push({
      id: `axis-${widthIndex}`,
      kind,
      x1: bottomX,
      y1: viewHeight + 80,
      x2: horizonX,
      y2: frame.horizonY,
      opacity: resolveLineOpacity(kind, 0.3, lateralRatio, config)
    });
  }

  for (let depthIndex = 0; depthIndex <= config.visibleDepth; depthIndex += 1) {
    const depthRatio = depthIndex / Math.max(1, config.visibleDepth);
    const y = projectDepthY(depthRatio, config.perspectiveTilt, frame);

    for (let widthIndex = -config.visibleWidth; widthIndex <= config.visibleWidth; widthIndex += 2) {
      const lateralRatio = Math.abs(widthIndex) / Math.max(1, config.visibleWidth);
      const x = projectDepthX(widthIndex, depthRatio, config, frame);
      const opacity = config.nodeOpacity * falloff(depthRatio, config.horizonFalloff) * falloff(lateralRatio, config.lateralFalloff);

      if (opacity < 0.025) {
        continue;
      }

      nodes.push({
        id: `node-${depthIndex}-${widthIndex}`,
        x,
        y,
        radius: widthIndex === 0 || depthIndex === 0 ? 1.6 : 0.9,
        opacity
      });
    }
  }

  nodes.push({
    id: 'origin',
    x: frame.originX,
    y: frame.originY,
    radius: 3,
    opacity: config.originNodeOpacity,
    origin: true
  });

  return {
    width: viewWidth,
    height: viewHeight,
    horizonY: frame.horizonY,
    originX: frame.originX,
    originY: frame.originY,
    vanishingPointX: frame.vanishingPointX,
    vanishingPointY: frame.vanishingPointY,
    lines,
    nodes
  };
}

function resolveQualityConfig(
  config: SpatialProjectionGridConfig,
  quality: AmbientQuality
): SpatialProjectionGridConfig {
  if (quality === 'off') {
    return { ...config, enabled: false, animationSpeed: 0 };
  }

  if (quality === 'low') {
    return {
      ...config,
      minorDivisions: Math.max(2, Math.round(config.minorDivisions * 0.55)),
      visibleDepth: Math.max(7, Math.round(config.visibleDepth * 0.72)),
      visibleWidth: Math.max(6, Math.round(config.visibleWidth * 0.74)),
      majorLineOpacity: config.majorLineOpacity * 0.78,
      minorLineOpacity: config.minorLineOpacity * 0.58,
      nodeOpacity: config.nodeOpacity * 0.58,
      glowIntensity: config.glowIntensity * 0.62,
      fogIntensity: config.fogIntensity * 0.82,
      animationSpeed: config.animationSpeed * 0.5
    };
  }

  if (quality === 'high') {
    return {
      ...config,
      minorDivisions: Math.min(8, config.minorDivisions + 1),
      visibleDepth: Math.round(config.visibleDepth * 1.12),
      visibleWidth: Math.round(config.visibleWidth * 1.08),
      majorLineOpacity: config.majorLineOpacity * 1.08,
      minorLineOpacity: config.minorLineOpacity * 1.12,
      nodeOpacity: config.nodeOpacity * 1.12,
      glowIntensity: config.glowIntensity * 1.16
    };
  }

  return config;
}

function clampGridConfig(config: SpatialProjectionGridConfig): SpatialProjectionGridConfig {
  return {
    ...config,
    majorStep: clamp(config.majorStep, 48, 180),
    minorDivisions: Math.round(clamp(config.minorDivisions, 1, 10)),
    visibleDepth: Math.round(clamp(config.visibleDepth, 4, 24)),
    visibleWidth: Math.round(clamp(config.visibleWidth, 4, 18)),
    vanishingPointX: clamp(config.vanishingPointX, 0.08, 0.92),
    vanishingPointY: clamp(config.vanishingPointY, 0.08, 0.72),
    horizonY: clamp(config.horizonY, 0.12, 0.82),
    originY: clamp(config.originY, 0.58, 1.05),
    perspectiveTilt: clamp01(config.perspectiveTilt),
    horizonFalloff: clamp01(config.horizonFalloff),
    lateralFalloff: clamp01(config.lateralFalloff),
    majorLineOpacity: clamp01(config.majorLineOpacity),
    minorLineOpacity: clamp01(config.minorLineOpacity),
    nodeOpacity: clamp01(config.nodeOpacity),
    originNodeOpacity: clamp01(config.originNodeOpacity),
    glowIntensity: clamp01(config.glowIntensity),
    fogIntensity: clamp01(config.fogIntensity),
    animationSpeed: clamp01(config.animationSpeed)
  };
}

function resolveLineOpacity(
  kind: SpatialProjectionGridLineKind,
  depthRatio: number,
  lateralRatio: number,
  config: SpatialProjectionGridConfig
): number {
  const baseOpacity =
    kind === 'axis'
      ? config.majorLineOpacity * 1.35
      : kind === 'major'
        ? config.majorLineOpacity
        : kind === 'minor'
          ? config.minorLineOpacity
          : config.minorLineOpacity * 0.45;

  return clamp01(baseOpacity * falloff(depthRatio, config.horizonFalloff) * falloff(lateralRatio, config.lateralFalloff));
}

function createProjectionFrame(config: SpatialProjectionGridConfig): SpatialProjectionFrame {
  return {
    originX: config.vanishingPointX * viewWidth,
    originY: config.originY * viewHeight,
    horizonX: config.vanishingPointX * viewWidth,
    horizonY: config.horizonY * viewHeight,
    vanishingPointX: config.vanishingPointX * viewWidth,
    vanishingPointY: config.vanishingPointY * viewHeight
  };
}

function projectDepthY(depthRatio: number, perspectiveTilt: number, frame: SpatialProjectionFrame): number {
  const easedDepth = 1 - Math.pow(1 - clamp01(depthRatio), 1.8 + perspectiveTilt * 1.4);
  return frame.originY - easedDepth * (frame.originY - frame.horizonY);
}

function projectWidthFactor(depthRatio: number, perspectiveTilt: number): number {
  return 1 - clamp01(depthRatio) * (0.72 + perspectiveTilt * 0.18);
}

function projectDepthX(
  widthIndex: number,
  depthRatio: number,
  config: SpatialProjectionGridConfig,
  frame: SpatialProjectionFrame
): number {
  const widthFactor = projectWidthFactor(depthRatio, config.perspectiveTilt);
  const depthX = frame.originX + widthIndex * config.majorStep * widthFactor;

  return depthX + (frame.horizonX - frame.originX) * depthRatio;
}

function falloff(value: number, amount: number): number {
  return Math.pow(1 - clamp01(value), 0.7 + amount * 1.7);
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}
