import { GameSettings, UserStats, GameHistoryItem } from '../types';

const SETTINGS_KEY = 'digit_root_dash_settings_v1';
const STATS_KEY = 'digit_root_dash_stats_v1';
const HISTORY_KEY = 'digit_root_dash_history_v1';

export const defaultSettings: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.8,
  hapticsEnabled: true,
  timerDuration: 60,
  sprintTarget: 20,
  theme: 'dark',
  autoSubmit: true,
};

export const defaultStats: UserStats = {
  timed: { highScore: 0, maxStreak: 0, totalSolved: 0, totalAttempts: 0, gamesPlayed: 0 },
  sprint: { highScore: 0, maxStreak: 0, totalSolved: 0, totalAttempts: 0, gamesPlayed: 0 },
  survival: { highScore: 0, maxStreak: 0, totalSolved: 0, totalAttempts: 0, gamesPlayed: 0 },
  zen: { highScore: 0, maxStreak: 0, totalSolved: 0, totalAttempts: 0, gamesPlayed: 0 },
  totalPoints: 0,
  level: 1,
};

export function loadSettings(): GameSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage', e);
  }
}

export function loadUserStats(): UserStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? { ...defaultStats, ...JSON.parse(data) } : defaultStats;
  } catch {
    return defaultStats;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save stats to localStorage', e);
  }
}

export function loadGameHistory(): GameHistoryItem[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGameHistory(item: Omit<GameHistoryItem, 'id' | 'date'>): GameHistoryItem[] {
  try {
    const history = loadGameHistory();
    const newItem: GameHistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
    };
    const updated = [newItem, ...history].slice(0, 30); // Keep last 30 games
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save game history', e);
    return [];
  }
}
