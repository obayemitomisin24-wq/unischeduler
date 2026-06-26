/**
 * settings.ts — persisted app settings using localStorage
 */
import { AppSettings } from '../types';

const KEY = 'uni_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  theme:        'light',
  primaryColor: 'indigo',
  fontSize:     'md',
  compactMode:  false,
  notifications: true,
  language:     'en',
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

export function saveSettings(s: AppSettings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function applyTheme(theme: 'light' | 'dark'): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
