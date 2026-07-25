import React, { useEffect, useState } from 'react';
import { GameMode, GameDifficulty, GameSettings, UserStats } from '../types';
import { shouldStartFromMenuShortcut } from '../utils/game';
import { CollapseDemo } from './CollapseDemo';

interface MainMenuProps {
  stats: UserStats;
  settings: GameSettings;
  onStartGame: (mode: GameMode, difficulty?: GameDifficulty) => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  shortcutBlocked?: boolean;
}

const MODES: Array<{ id: GameMode; name: string; blurb: string }> = [
  { id: 'timed', name: 'Timed', blurb: 'Score as many roots as the clock allows.' },
  { id: 'sprint', name: 'Sprint', blurb: 'Race a fixed set of roots. Fastest time wins.' },
  { id: 'survival', name: 'Survival', blurb: 'Three lives. Numbers keep getting longer.' },
  { id: 'zen', name: 'Zen', blurb: 'No clock. You choose the digit length.' },
];

const DIFFICULTIES: Array<{ id: GameDifficulty; digits: string }> = [
  { id: 'easy', digits: '2–3' },
  { id: 'medium', digits: '4–5' },
  { id: 'hard', digits: '6–8' },
  { id: 'master', digits: '9–12' },
];

export const MainMenu: React.FC<MainMenuProps> = ({
  stats,
  settings,
  onStartGame,
  onOpenRules,
  onOpenStats,
  onOpenSettings,
  shortcutBlocked = false,
}) => {
  const [mode, setMode] = useState<GameMode>('timed');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');

  const active = MODES.find((m) => m.id === mode)!;
  const zenDigits = DIFFICULTIES.find((d) => d.id === difficulty)!.digits;

  const setup: Record<GameMode, string> = {
    timed: `${settings.timerDuration} seconds`,
    sprint: `${settings.sprintTarget} roots`,
    survival: '3 lives',
    zen: `${zenDigits} digits`,
  };

  const best: Record<GameMode, string> = {
    timed: stats.timed.highScore ? `${stats.timed.highScore} pts` : 'no run yet',
    sprint: stats.sprint.fastestTime ? `${stats.sprint.fastestTime}s` : 'no run yet',
    survival: stats.survival.highScore ? `${stats.survival.highScore} pts` : 'no run yet',
    zen: stats.zen.totalSolved ? `${stats.zen.totalSolved} solved` : 'no run yet',
  };

  const start = () => onStartGame(mode, difficulty);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        shouldStartFromMenuShortcut(
          e.key,
          target?.tagName ?? '',
          shortcutBlocked || Boolean(target?.isContentEditable),
        )
      ) {
        onStartGame(mode, difficulty);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [difficulty, mode, onStartGame, shortcutBlocked]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="shrink-0">
        <h1 className="wordmark text-[clamp(3rem,17vw,4.5rem)] text-chalk">
          Digit Root
          <br />
          Dash
        </h1>
        <div className="mt-2 h-px w-full bg-rule" />
        <p className="label mt-2">Cast out nines · reduce to one digit</p>
      </header>

      <section className="flex flex-1 flex-col justify-center py-4">
        <CollapseDemo />
      </section>

      <section className="shrink-0">
        <nav className="flex border-y border-rule" aria-label="Game mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={`flex-1 border-b-2 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                mode === m.id
                  ? 'border-race text-chalk'
                  : 'border-transparent text-dim hover:text-chalk'
              }`}
            >
              {m.name}
            </button>
          ))}
        </nav>

        <div className="flex min-h-[72px] flex-col gap-2 py-3">
          <p className="text-sm text-chalk">{active.blurb}</p>

          {mode === 'zen' && (
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  aria-pressed={difficulty === d.id}
                  className={`flex-1 rounded-sharp border px-1 py-1.5 text-[11px] capitalize transition ${
                    difficulty === d.id
                      ? 'border-chalk bg-key text-chalk'
                      : 'border-rule text-dim hover:text-chalk'
                  }`}
                >
                  {d.id}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between text-xs text-dim">
            <span>{setup[mode]}</span>
            <span>
              best <span className="font-num text-chalk">{best[mode]}</span>
            </span>
          </div>
        </div>

        <button
          onClick={start}
          className="w-full rounded-sharp bg-chalk py-3.5 text-ink transition active:scale-[0.99]"
        >
          <span className="wordmark text-3xl">Start {active.name}</span>
        </button>

        <div className="mt-4 flex divide-x divide-rule border-t border-rule pt-3">
          {[
            { label: 'Stats', action: onOpenStats },
            { label: 'How to play', action: onOpenRules },
            { label: 'Settings', action: onOpenSettings },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="label flex-1 py-1 transition-colors hover:text-chalk"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
