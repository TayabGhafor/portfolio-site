export type PerformanceTier = 'high' | 'balanced' | 'saver';
export type CoreTheme = 'mono' | 'cyan' | 'emerald' | 'solar' | 'crimson';
export type AudioTrack = 'lofi-focus' | 'neon-nights';

const preferencesVersion = 'system-v2';

export interface SitePreferences {
  theme: CoreTheme;
  audioEnabled: boolean;
  audioTrack: AudioTrack;
  tier: PerformanceTier;
}

export const defaultSitePreferences: SitePreferences = {
  theme: 'mono',
  audioEnabled: false,
  audioTrack: 'lofi-focus',
  tier: 'high',
};

function isTheme(value: string | null): value is CoreTheme {
  return value === 'mono' || value === 'cyan' || value === 'emerald' || value === 'solar' || value === 'crimson';
}

function isAudioTrack(value: string | null): value is AudioTrack {
  return value === 'lofi-focus' || value === 'neon-nights';
}

function isPerformanceTier(value: string | null): value is PerformanceTier {
  return value === 'high' || value === 'balanced' || value === 'saver';
}

export function readSitePreferences(): SitePreferences {
  const themeValue = window.localStorage.getItem('tm-core-theme');
  const trackValue = window.localStorage.getItem('tm-audio-track');
  const tierValue = window.localStorage.getItem('tm-performance');
  const preferences: SitePreferences = {
    theme: isTheme(themeValue) ? themeValue : defaultSitePreferences.theme,
    audioEnabled: window.localStorage.getItem('tm-audio-enabled') === 'on',
    audioTrack: isAudioTrack(trackValue) ? trackValue : defaultSitePreferences.audioTrack,
    tier: isPerformanceTier(tierValue) ? tierValue : defaultSitePreferences.tier,
  };

  window.localStorage.setItem('tm-preferences-version', preferencesVersion);
  return preferences;
}

export function persistSitePreferences(preferences: SitePreferences) {
  window.localStorage.setItem('tm-core-theme', preferences.theme);
  window.localStorage.setItem('tm-audio-enabled', preferences.audioEnabled ? 'on' : 'off');
  window.localStorage.setItem('tm-audio-track', preferences.audioTrack);
  window.localStorage.setItem('tm-performance', preferences.tier);
  window.localStorage.setItem('tm-motion', preferences.tier === 'saver' ? 'reduced' : 'full');
  window.localStorage.setItem('tm-preferences-version', preferencesVersion);
}
