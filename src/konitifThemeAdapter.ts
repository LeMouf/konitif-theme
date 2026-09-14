import type { KonitifThemeMode } from './konitifTheme';

export function applyKonitifTheme(mode: KonitifThemeMode, target?: HTMLElement | null): void {
  const resolvedTarget = target ?? (typeof document === 'undefined' ? null : document.documentElement);

  if (!resolvedTarget) {
    return;
  }

  resolvedTarget.dataset.theme = mode;
  resolvedTarget.dataset.workbenchTheme = 'konitif';
  resolvedTarget.dataset.workbenchColorMode = mode === 'konitif-light' ? 'light' : 'dark';
}
