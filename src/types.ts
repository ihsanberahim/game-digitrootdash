export type GameMode = 'timed' | 'sprint' | 'survival' | 'zen';

export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'master';

export type GameTheme = 'board' | 'paper' | 'led';

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
  timerDuration: number;
  sprintTarget: number;
  theme: GameTheme;
  autoSubmit: boolean;
}

export interface ModeStats {
  highScore: number;
  fastestTime?: number;
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

/** One cancellation move: a lone 9, a lone 0, or a pair summing to 9. */
export interface CancelGroup {
  indices: number[];
  kind: 'nine' | 'zero' | 'pair';
  label: string;
}

export interface StepBreakdown {
  original: string;
  steps: Array<{
    expression: string;
    sum: number;
  }>;
  digitalRoot: number;
  castingOutNines: {
    cancelledDigits: number[];
    groups: CancelGroup[];
    remainingDigits: number[];
    remainingSum: number;
    finalRoot: number;
  };
}

export interface GameSessionResult {
  score: number;
  solved: number;
  totalAttempts: number;
  maxStreak: number;
  timeTaken: number;
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
