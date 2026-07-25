import React, { useState } from 'react';
import { GameHistoryItem, GameMode, UserStats } from '../types';
import { Sheet, SheetButton } from './Sheet';

interface StatsModalProps {
  stats: UserStats;
  history: GameHistoryItem[];
  onClose: () => void;
}

function plural(count: number, singular: string, pluralForm: string): string {
  return count === 1 ? singular : pluralForm;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, history, onClose }) => {
  const [tab, setTab] = useState<'records' | 'history'>('records');

  const records: Array<{
    mode: GameMode;
    name: string;
    headline: string;
    detail: string;
  }> = [
    {
      mode: 'timed',
      name: 'Timed',
      headline: `${stats.timed.highScore} pts`,
      detail: `${stats.timed.totalSolved} solved · ${stats.timed.maxStreak}× streak`,
    },
    {
      mode: 'sprint',
      name: 'Sprint',
      headline: stats.sprint.fastestTime ? `${stats.sprint.fastestTime}s` : '—',
      detail: `${stats.sprint.gamesPlayed} ${plural(stats.sprint.gamesPlayed, 'run', 'runs')} · ${stats.sprint.maxStreak}× streak`,
    },
    {
      mode: 'survival',
      name: 'Survival',
      headline: `${stats.survival.highScore} pts`,
      detail: `${stats.survival.totalSolved} solved · ${stats.survival.maxStreak}× streak`,
    },
    {
      mode: 'zen',
      name: 'Zen',
      headline: `${stats.zen.totalSolved} solved`,
      detail: `${stats.zen.gamesPlayed} ${plural(stats.zen.gamesPlayed, 'session', 'sessions')}`,
    },
  ];

  const totalSolved =
    stats.timed.totalSolved +
    stats.sprint.totalSolved +
    stats.survival.totalSolved +
    stats.zen.totalSolved;

  return (
    <Sheet
      title="Records"
      onClose={onClose}
      footer={<SheetButton onClick={onClose}>Close</SheetButton>}
    >
      <div className="mb-2 flex gap-4 border-b border-rule">
        {(['records', 'history'] as const).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`label -mb-px border-b-2 pb-2 transition-colors ${
              tab === id ? 'border-race text-chalk' : 'border-transparent hover:text-chalk'
            }`}
          >
            {id === 'records' ? 'Personal bests' : `Runs (${history.length})`}
          </button>
        ))}
      </div>

      {tab === 'records' ? (
        <>
          <dl className="divide-y divide-rule">
            {records.map((record) => (
              <div key={record.mode} className="flex items-start justify-between py-3">
                <div>
                  <dt className="text-sm font-medium text-chalk">{record.name}</dt>
                  <dd className="mt-0.5 text-xs text-dim">{record.detail}</dd>
                </div>
                <span className="font-num text-lg font-bold tnum text-chalk">
                  {record.headline}
                </span>
              </div>
            ))}
          </dl>

          <div className="flex justify-between border-t border-rule pt-3">
            <span className="label">
              Career <span className="font-num text-chalk">{stats.totalPoints}</span> pts
            </span>
            <span className="label">
              <span className="font-num text-chalk">{totalSolved}</span> roots reduced
            </span>
          </div>
        </>
      ) : history.length === 0 ? (
        <p className="py-8 text-center text-sm text-dim">
          No runs yet. Your last 30 will show up here.
        </p>
      ) : (
        <ul className="divide-y divide-rule">
          {history.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2.5">
              <div>
                <span className="text-sm capitalize text-chalk">{item.mode}</span>
                <span className="label ml-2">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-right">
                <div className="font-num text-sm font-bold tnum text-chalk">
                  {item.score} pts
                </div>
                <div className="text-[11px] text-dim">
                  {item.solved} solved · {item.accuracy}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
};
