export type GameMode = 'timed' | 'sprint' | 'survival' | 'zen';

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'master';

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  hapticsEnabled: boolean;
  timerDuration: number; // 30, 60, 90 seconds
  sprintTarget: number; // 10, 20, 50 problems
  theme: 'dark' | 'neon' | 'midnight' | 'light';
  autoSubmit: boolean;
}

export interface ModeStats {
  highScore: number;
  fastestTime?: number; // in seconds for Sprint mode
  maxStreak: number;
  totalSolved: number;
  totalAttempts: number;
  gamesPlayed: number;
}

export interface UserStats {
  timed: ModeStats;
  sprint: ModeStats;
  survival: ModeStats;
  zen: ModeStats;
  totalPoints: number;
  level: number;
}

export interface StepBreakdown {
  original: string;
  steps: Array<{
    expression: string;
    sum: number;
  }>;
  digitalRoot: number;
  castingOutNines: {
    cancelledDigits: number[]; // indices of digits that cancel out (9s or sum to 9)
    remainingDigits: number[];
    remainingSum: number;
    finalRoot: number;
  };
}

export interface GameHistoryItem {
  id: string;
  date: string;
  mode: GameMode;
  score: number;
  solved: number;
  accuracy: number;
  maxStreak: number;
}
