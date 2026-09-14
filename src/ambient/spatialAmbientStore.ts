import { writable } from 'svelte/store';
import type { SpatialAmbientConfig } from './spatialAmbientTypes';
export const spatialAmbientStore=writable<SpatialAmbientConfig>({phase:'LAUNCH_GATE',quality:'medium',reducedMotion:false,focusX:.5,focusY:.42});
