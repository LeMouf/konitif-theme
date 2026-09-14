export type KonitifSurfaceRole = 'shell' | 'panel' | 'tool' | 'overlay' | 'inspector' | 'modal';

export type KonitifDepthLevel = 'ambient' | 'background' | 'workspace' | 'panel' | 'active' | 'overlay';

export type PerceptualFocusPoint = {
  x: number;
  y: number;
};

export type PerceptualFocusState = {
  activeSurfaceId: string | null;
  activeRole: KonitifSurfaceRole | null;
  activeDepth: KonitifDepthLevel | null;
  focusPoint: PerceptualFocusPoint;
  focusStrength: number;
};

export type PerceptualSurfaceRegistration = {
  id: string;
  role: KonitifSurfaceRole;
  depth: KonitifDepthLevel;
};

export type PerceptualFocusUpdate = PerceptualSurfaceRegistration & {
  focusPoint?: Partial<PerceptualFocusPoint>;
  focusStrength?: number;
};

export type PerceptualFocusStore = {
  subscribe: (run: (state: PerceptualFocusState) => void) => () => void;
  registerSurface: (surface: PerceptualSurfaceRegistration) => void;
  unregisterSurface: (surfaceId: string) => void;
  setActiveSurface: (update: PerceptualFocusUpdate) => void;
  clearActiveSurface: (surfaceId?: string) => void;
  setFocusPoint: (focusPoint: Partial<PerceptualFocusPoint>) => void;
  getState: () => PerceptualFocusState;
  getSurface: (surfaceId: string) => PerceptualSurfaceRegistration | null;
};
