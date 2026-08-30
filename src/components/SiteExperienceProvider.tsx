'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  defaultSitePreferences,
  persistSitePreferences,
  readSitePreferences,
  type AudioTrack,
  type CoreTheme,
  type PerformanceTier,
  type SitePreferences,
} from '../lib/sitePreferences';

const trackSources: Record<AudioTrack, string> = {
  'lofi-focus': '/audio/lofi-focus.mp3',
  'neon-nights': '/audio/neon-nights.mp3',
};

interface SiteExperienceContextValue extends SitePreferences {
  motion: boolean;
  setTheme: (theme: CoreTheme) => void;
  setTier: (tier: PerformanceTier) => void;
  setAudioEnabled: (enabled: boolean) => void;
  toggleAudio: () => void;
  selectAudioTrack: (track: AudioTrack) => void;
}

const SiteExperienceContext = createContext<SiteExperienceContextValue | null>(null);

export function SiteExperienceProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<SitePreferences>(defaultSitePreferences);
  const preferencesRef = useRef(preferences);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const commitPreferences = useCallback((next: SitePreferences) => {
    preferencesRef.current = next;
    setPreferences(next);
    persistSitePreferences(next);
  }, []);

  const playInterfaceClick = useCallback(() => {
    const AudioContextConstructor = window.AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const audioContext = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = audioContext;
    if (audioContext.state === 'suspended') void audioContext.resume();

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(310, now + .055);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.028, now + .006);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .075);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + .08);
  }, []);

  const playTrack = useCallback((track: AudioTrack, restart = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    const source = trackSources[track];
    const sourceUrl = new URL(source, window.location.origin).href;
    if (audio.src !== sourceUrl) audio.src = source;
    if (restart) audio.currentTime = 0;
    audio.volume = .22;
    void audio.play().catch(() => {
      // Browsers can defer playback until the next direct user interaction.
    });
  }, []);

  useEffect(() => {
    window.queueMicrotask(() => {
      const stored = readSitePreferences();
      preferencesRef.current = stored;
      setPreferences(stored);
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.coreTheme = preferences.theme;
    document.documentElement.dataset.performance = preferences.tier;
  }, [preferences.theme, preferences.tier]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = trackSources[preferences.audioTrack];
    audio.volume = .22;
    if (preferences.audioEnabled) playTrack(preferences.audioTrack);
    else audio.pause();
  }, [playTrack, preferences.audioEnabled, preferences.audioTrack]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('button:not(:disabled), a[href], [role="button"]')) return;
      playInterfaceClick();
      const current = preferencesRef.current;
      if (current.audioEnabled && audioRef.current?.paused) playTrack(current.audioTrack);
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [playInterfaceClick, playTrack]);

  const setTheme = useCallback((theme: CoreTheme) => {
    commitPreferences({ ...preferencesRef.current, theme });
  }, [commitPreferences]);

  const setTier = useCallback((tier: PerformanceTier) => {
    commitPreferences({ ...preferencesRef.current, tier });
  }, [commitPreferences]);

  const setAudioEnabled = useCallback((audioEnabled: boolean) => {
    const next = { ...preferencesRef.current, audioEnabled };
    commitPreferences(next);
    if (audioEnabled) {
      playTrack(next.audioTrack);
    } else {
      audioRef.current?.pause();
    }
  }, [commitPreferences, playTrack]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(!preferencesRef.current.audioEnabled);
  }, [setAudioEnabled]);

  const selectAudioTrack = useCallback((audioTrack: AudioTrack) => {
    const next = { ...preferencesRef.current, audioTrack, audioEnabled: true };
    commitPreferences(next);
    playTrack(audioTrack, true);
  }, [commitPreferences, playTrack]);

  const value = useMemo<SiteExperienceContextValue>(() => ({
    ...preferences,
    motion: preferences.tier !== 'saver',
    setTheme,
    setTier,
    setAudioEnabled,
    toggleAudio,
    selectAudioTrack,
  }), [preferences, selectAudioTrack, setAudioEnabled, setTheme, setTier, toggleAudio]);

  return (
    <SiteExperienceContext.Provider value={value}>
      {children}
      <audio ref={audioRef} className="site-audio-engine" loop preload="metadata" aria-hidden="true" />
    </SiteExperienceContext.Provider>
  );
}

export function useSiteExperience() {
  const context = useContext(SiteExperienceContext);
  if (!context) throw new Error('useSiteExperience must be used inside SiteExperienceProvider');
  return context;
}
