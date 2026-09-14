import { normalizeKonitifRuntimePhase, type RuntimePhase } from '../konitifRuntimePhaseTokens';
import type { AmbientQuality } from '../ambient/spatialAmbientTypes';

export type RuntimeSpatialState = {
  phase: RuntimePhase;
  tint: string;
  tintRgb: string;
  fogDensity: number;
  particleDensity: number;
  particleSpeed: number;
  lightIntensity: number;
  motionIntensity: number;
  tiltStrength: number;
  focusFalloff: number;
  instability: number;
};

export type RuntimeSpatialStateOptions = {
  quality?: AmbientQuality;
  reducedMotion?: boolean;
  hidden?: boolean;
};

const baseSpatialState = {
  BOOT: {
    tint: 'var(--k-accent-secondary)',
    tintRgb: '96, 165, 250',
    fogDensity: 0.18,
    particleDensity: 0.24,
    particleSpeed: 0.18,
    lightIntensity: 0.28,
    motionIntensity: 0.16,
    tiltStrength: 0.08,
    focusFalloff: 0.52,
    instability: 0.06
  },
  LAUNCH_GATE: {
    tint: 'var(--k-accent-primary)',
    tintRgb: '34, 211, 238',
    fogDensity: 0.24,
    particleDensity: 0.34,
    particleSpeed: 0.22,
    lightIntensity: 0.38,
    motionIntensity: 0.2,
    tiltStrength: 0.1,
    focusFalloff: 0.56,
    instability: 0.04
  },
  CONTEXT_RESOLVED: {
    tint: 'var(--k-accent-primary)',
    tintRgb: '34, 211, 238',
    fogDensity: 0.24,
    particleDensity: 0.36,
    particleSpeed: 0.24,
    lightIntensity: 0.4,
    motionIntensity: 0.22,
    tiltStrength: 0.1,
    focusFalloff: 0.56,
    instability: 0.04
  },
  PREFLIGHT: {
    tint: 'var(--k-accent-success)',
    tintRgb: '74, 222, 128',
    fogDensity: 0.28,
    particleDensity: 0.42,
    particleSpeed: 0.28,
    lightIntensity: 0.44,
    motionIntensity: 0.28,
    tiltStrength: 0.12,
    focusFalloff: 0.62,
    instability: 0.05
  },
  PLANNED: {
    tint: 'var(--k-accent-success)',
    tintRgb: '74, 222, 128',
    fogDensity: 0.22,
    particleDensity: 0.36,
    particleSpeed: 0.24,
    lightIntensity: 0.46,
    motionIntensity: 0.22,
    tiltStrength: 0.1,
    focusFalloff: 0.66,
    instability: 0.03
  },
  INITIALIZING: {
    tint: 'var(--k-accent-secondary)',
    tintRgb: '96, 165, 250',
    fogDensity: 0.34,
    particleDensity: 0.62,
    particleSpeed: 0.54,
    lightIntensity: 0.58,
    motionIntensity: 0.56,
    tiltStrength: 0.16,
    focusFalloff: 0.6,
    instability: 0.16
  },
  HYDRATING: {
    tint: 'var(--k-accent-hydration)',
    tintRgb: '168, 85, 247',
    fogDensity: 0.42,
    particleDensity: 0.54,
    particleSpeed: 0.36,
    lightIntensity: 0.52,
    motionIntensity: 0.34,
    tiltStrength: 0.18,
    focusFalloff: 0.7,
    instability: 0.12
  },
  RUNNING: {
    tint: 'var(--k-accent-primary)',
    tintRgb: '34, 211, 238',
    fogDensity: 0.3,
    particleDensity: 0.46,
    particleSpeed: 0.3,
    lightIntensity: 0.62,
    motionIntensity: 0.32,
    tiltStrength: 0.14,
    focusFalloff: 0.68,
    instability: 0.04
  },
  SUSPENDING: {
    tint: 'var(--k-accent-warning)',
    tintRgb: '245, 158, 11',
    fogDensity: 0.34,
    particleDensity: 0.3,
    particleSpeed: 0.14,
    lightIntensity: 0.32,
    motionIntensity: 0.12,
    tiltStrength: 0.08,
    focusFalloff: 0.48,
    instability: 0.08
  },
  SUSPENDED: {
    tint: 'var(--k-accent-warning)',
    tintRgb: '245, 158, 11',
    fogDensity: 0.38,
    particleDensity: 0.12,
    particleSpeed: 0.04,
    lightIntensity: 0.2,
    motionIntensity: 0.04,
    tiltStrength: 0.03,
    focusFalloff: 0.38,
    instability: 0.02
  },
  RESUMING: {
    tint: 'var(--k-accent-primary)',
    tintRgb: '34, 211, 238',
    fogDensity: 0.32,
    particleDensity: 0.48,
    particleSpeed: 0.42,
    lightIntensity: 0.5,
    motionIntensity: 0.44,
    tiltStrength: 0.14,
    focusFalloff: 0.58,
    instability: 0.1
  },
  TEARDOWN: {
    tint: 'var(--k-accent-warning)',
    tintRgb: '245, 158, 11',
    fogDensity: 0.32,
    particleDensity: 0.26,
    particleSpeed: 0.16,
    lightIntensity: 0.28,
    motionIntensity: 0.12,
    tiltStrength: 0.08,
    focusFalloff: 0.46,
    instability: 0.1
  },
  TEARING_DOWN: {
    tint: 'var(--k-accent-warning)',
    tintRgb: '245, 158, 11',
    fogDensity: 0.32,
    particleDensity: 0.26,
    particleSpeed: 0.16,
    lightIntensity: 0.28,
    motionIntensity: 0.12,
    tiltStrength: 0.08,
    focusFalloff: 0.46,
    instability: 0.1
  },
  RECOVERY: {
    tint: 'var(--k-accent-error)',
    tintRgb: '239, 68, 68',
    fogDensity: 0.44,
    particleDensity: 0.46,
    particleSpeed: 0.38,
    lightIntensity: 0.52,
    motionIntensity: 0.36,
    tiltStrength: 0.2,
    focusFalloff: 0.5,
    instability: 0.34
  },
  RECOVERING: {
    tint: 'var(--k-accent-error)',
    tintRgb: '239, 68, 68',
    fogDensity: 0.44,
    particleDensity: 0.46,
    particleSpeed: 0.38,
    lightIntensity: 0.52,
    motionIntensity: 0.36,
    tiltStrength: 0.2,
    focusFalloff: 0.5,
    instability: 0.34
  },
  SAFE_MODE: {
    tint: 'var(--k-accent-error)',
    tintRgb: '239, 68, 68',
    fogDensity: 0.12,
    particleDensity: 0.08,
    particleSpeed: 0.02,
    lightIntensity: 0.18,
    motionIntensity: 0.02,
    tiltStrength: 0.02,
    focusFalloff: 0.34,
    instability: 0.04
  }
} satisfies Record<RuntimePhase, Omit<RuntimeSpatialState, 'phase'>>;

const qualityDensityFactor: Record<AmbientQuality, number> = {
  off: 0,
  low: 0.46,
  medium: 1,
  high: 1.34
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function smoothStep(progress: number): number {
  const clamped = clamp01(progress);
  return clamped * clamped * (3 - 2 * clamped);
}

function parseTintRgb(value: string): [number, number, number] {
  const channels = value.split(',').map((channel) => Number.parseFloat(channel.trim()));
  return [
    Number.isFinite(channels[0]) ? channels[0] : 34,
    Number.isFinite(channels[1]) ? channels[1] : 211,
    Number.isFinite(channels[2]) ? channels[2] : 238
  ];
}

function formatTintRgb(channels: [number, number, number]): string {
  return channels.map((channel) => String(Math.round(Math.min(255, Math.max(0, channel))))).join(', ');
}

export function createRuntimeSpatialState(
  phase: RuntimePhase | string | null | undefined,
  options: RuntimeSpatialStateOptions = {}
): RuntimeSpatialState {
  const resolvedPhase = normalizeKonitifRuntimePhase(phase);
  const quality = options.quality ?? 'medium';
  const base = baseSpatialState[resolvedPhase] ?? baseSpatialState.LAUNCH_GATE;
  const densityFactor = qualityDensityFactor[quality];
  const motionFactor = options.reducedMotion || options.hidden ? 0.08 : quality === 'low' ? 0.58 : quality === 'high' ? 1.12 : 1;

  return {
    phase: resolvedPhase,
    tint: base.tint,
    tintRgb: base.tintRgb,
    fogDensity: clamp01(base.fogDensity * (quality === 'off' ? 0.18 : quality === 'low' ? 0.7 : quality === 'high' ? 1.12 : 1)),
    particleDensity: clamp01(base.particleDensity * densityFactor),
    particleSpeed: clamp01(base.particleSpeed * motionFactor),
    lightIntensity: clamp01(base.lightIntensity * (quality === 'off' ? 0.3 : quality === 'low' ? 0.78 : quality === 'high' ? 1.08 : 1)),
    motionIntensity: clamp01(base.motionIntensity * motionFactor),
    tiltStrength: clamp01(base.tiltStrength * motionFactor),
    focusFalloff: clamp01(base.focusFalloff),
    instability: clamp01(base.instability * (options.reducedMotion ? 0.3 : 1))
  };
}

export function interpolateRuntimeSpatialState(
  from: RuntimeSpatialState,
  to: RuntimeSpatialState,
  progress: number
): RuntimeSpatialState {
  const easedProgress = smoothStep(progress);
  const fromRgb = parseTintRgb(from.tintRgb);
  const toRgb = parseTintRgb(to.tintRgb);

  return {
    phase: easedProgress >= 0.5 ? to.phase : from.phase,
    tint: easedProgress >= 0.5 ? to.tint : from.tint,
    tintRgb: formatTintRgb([
      lerp(fromRgb[0], toRgb[0], easedProgress),
      lerp(fromRgb[1], toRgb[1], easedProgress),
      lerp(fromRgb[2], toRgb[2], easedProgress)
    ]),
    fogDensity: clamp01(lerp(from.fogDensity, to.fogDensity, easedProgress)),
    particleDensity: clamp01(lerp(from.particleDensity, to.particleDensity, easedProgress)),
    particleSpeed: clamp01(lerp(from.particleSpeed, to.particleSpeed, easedProgress)),
    lightIntensity: clamp01(lerp(from.lightIntensity, to.lightIntensity, easedProgress)),
    motionIntensity: clamp01(lerp(from.motionIntensity, to.motionIntensity, easedProgress)),
    tiltStrength: clamp01(lerp(from.tiltStrength, to.tiltStrength, easedProgress)),
    focusFalloff: clamp01(lerp(from.focusFalloff, to.focusFalloff, easedProgress)),
    instability: clamp01(lerp(from.instability, to.instability, easedProgress))
  };
}

export function shouldRunSpatialAnimation(quality: AmbientQuality, reducedMotion = false, hidden = false): boolean {
  return quality !== 'off' && !reducedMotion && !hidden;
}
