import { GameMode } from '../types';

const INTERACTIVE_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']);

export function shouldStartFromMenuShortcut(
  key: string,
  targetTagName: string,
  blocked: boolean,
): boolean {
  return key === 'Enter' && !blocked && !INTERACTIVE_TAGS.has(targetTagName);
}

export function shouldHandleGameKey(
  key: string,
  repeat: boolean,
  blocked: boolean,
): boolean {
  if (repeat || blocked) return false;
  return /^[0-9]$/.test(key) || key.toLowerCase() === 'h' || key === 'Escape';
}

export function calculateTimeTaken(
  mode: GameMode,
  timerDuration: number,
  _timeRemaining: number,
  elapsedTime: number,
): number {
  return mode === 'timed' ? timerDuration : elapsedTime;
}

export function shouldFinishOnQuit(mode: GameMode): boolean {
  return mode === 'zen';
}

export function calculateAccuracy(solved: number, totalAttempts: number): number {
  if (totalAttempts <= 0) return 100;
  return Math.round((solved / totalAttempts) * 100);
}
