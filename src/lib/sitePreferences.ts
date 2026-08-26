import type { PerformanceTier } from '../components/SiteControls';

const preferencesVersion = 'high-full-v1';

export interface SitePreferences {
  motion: boolean;
  tier: PerformanceTier;
}

export function readSitePreferences(): SitePreferences {
  const version = window.localStorage.getItem('tm-preferences-version');

  if (version !== preferencesVersion) {
    window.localStorage.setItem('tm-performance', 'high');
    window.localStorage.setItem('tm-motion', 'full');
    window.localStorage.setItem('tm-preferences-version', preferencesVersion);
    return { motion: true, tier: 'high' };
  }

  const storedTier = window.localStorage.getItem('tm-performance');
  const tier: PerformanceTier = storedTier === 'balanced' || storedTier === 'saver' ? storedTier : 'high';
  const motion = window.localStorage.getItem('tm-motion') !== 'reduced';

  return { motion, tier };
}
