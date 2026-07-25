import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameMode, GameSessionResult } from '../types';
import { calculateAccuracy } from '../utils/game';
import { Sheet, SheetButton } from './Sheet';

interface GameOverModalProps {
  mode: GameMode;
  result: GameSessionResult;
  isNewHighScore?: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

const TITLES: Record<GameMode, string> = {
  timed: "Time's up",
  sprint: 'Sprint done',
  survival: 'Out of lives',
  zen: 'Session ended',
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  mode,
  result,
  isNewHighScore = false,
  onPlayAgain,
  onHome,
}) => {
  const accuracy = calculateAccuracy(result.solved, result.totalAttempts);
  const avgSpeed =
    result.solved > 0 ? `${(result.timeTaken / result.solved).toFixed(1)}s` : '—';
  const isSprint = mode === 'sprint';
  const headline = isSprint ? `${result.timeTaken}s` : `${result.score}`;
  const headlineLabel = isSprint ? 'Total time' : 'Final score';

  useEffect(() => {
    if (!isNewHighScore) return;
    confetti({
      particleCount: 60,
      spread: 55,
      startVelocity: 32,
      origin: { y: 0.55 },
      colors: ['#e6b84d', '#3d9b7a', '#c45c26', '#f4f7f2'],
    });
  }, [isNewHighScore]);

  const rows: Array<[string, string]> = [
    ['Solved', `${result.solved}`],
    ['Accuracy', `${accuracy}%`],
    ['Longest streak', `${result.maxStreak}×`],
    ['Pace', `${avgSpeed} / root`],
  ];

  return (
    <Sheet
      title={TITLES[mode]}
      footer={
        <div className="space-y-2">
          <SheetButton variant="primary" onClick={onPlayAgain}>
            Play again
          </SheetButton>
          <SheetButton onClick={onHome}>Main menu</SheetButton>
        </div>
      }
    >
      <div className="flex items-end justify-between">
        <div>
          <span className="label">{headlineLabel}</span>
          <div className="font-num text-5xl font-bold tnum text-chalk">{headline}</div>
        </div>
        {isNewHighScore && (
          <span className="label border border-race px-2 py-1 text-race">
            Personal best
          </span>
        )}
      </div>

      <dl className="mt-5 divide-y divide-rule border-y border-rule">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2.5">
            <dt className="text-sm text-dim">{label}</dt>
            <dd className="font-num text-sm font-bold tnum text-chalk">{value}</dd>
          </div>
        ))}
      </dl>
    </Sheet>
  );
};
