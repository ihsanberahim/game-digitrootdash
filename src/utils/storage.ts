import { GameSettings, GameTheme, UserStats, GameHistoryItem, ModeStats } from '../types';

const SETTINGS_KEY = 'digit_root_dash_settings_v1';
const STATS_KEY = 'digit_root_dash_stats_v1';
const HISTORY_KEY = 'digit_root_dash_history_v1';

export const defaultSettings: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.8,
  hapticsEnabled: true,
  timerDuration: 60,
  sprintTarget: 20,
  theme: 'board',
  autoSubmit: true,
};

const LEGACY_THEMES: Record<string, GameTheme> = {
  dark: 'board',
  midnight: 'board',
  neon: 'led',
  light: 'paper',
};

function emptyModeStats(): ModeStats {
  return {
    highScore: 0,
    maxStreak: 0,
    totalSolved: 0,
    totalAttempts: 0,
    gamesPlayed: 0,
  };
}

export const defaultStats: UserStats = {
  timed: emptyModeStats(),
  sprint: emptyModeStats(),
  survival: emptyModeStats(),
  zen: emptyModeStats(),
  totalPoints: 0,
  level: 1,
};

function readStorage<T>(key: string, fallback: T, parse: (raw: string) => T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown, label: string): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${label} to localStorage`, e);
  }
}

export function loadSettings(): GameSettings {
  return readStorage(SETTINGS_KEY, defaultSettings, (raw) => {
    const stored = { ...defaultSettings, ...JSON.parse(raw) } as GameSettings;
    return {
      ...stored,
      theme: LEGACY_THEMES[stored.theme] ?? stored.theme,
    };
  });
}

export function saveSettings(settings: GameSettings): void {
  writeStorage(SETTINGS_KEY, settings, 'settings');
}

export function loadUserStats(): UserStats {
  return readStorage(STATS_KEY, defaultStats, (raw) => ({
    ...defaultStats,
    ...JSON.parse(raw),
  }));
}

export function saveUserStats(stats: UserStats): void {
  writeStorage(STATS_KEY, stats, 'stats');
}

export function loadGameHistory(): GameHistoryItem[] {
  return readStorage(HISTORY_KEY, [], (raw) => JSON.parse(raw));
}

export function clearGameHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn('Failed to clear game history', e);
  }
}

export function saveGameHistory(
  item: Omit<GameHistoryItem, 'id' | 'date'>,
): GameHistoryItem[] {
  try {
    const history = loadGameHistory();
    const newItem: GameHistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };
    const updated = [newItem, ...history].slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save game history', e);
    return [];
  }
}
