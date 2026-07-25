import React from 'react';
import { GameSettings, GameTheme } from '../types';
import { Sheet, SheetButton } from './Sheet';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetStats: () => void;
  onClose: () => void;
}

const THEMES: Array<{ id: GameTheme; name: string; note: string }> = [
  { id: 'board', name: 'Slate board', note: 'Chalk on dark green-black' },
  { id: 'paper', name: 'Ledger paper', note: 'Ink on warm paper' },
  { id: 'led', name: 'Race clock', note: 'Maximum contrast' },
];

function Choice<T extends number | string>({
  options,
  active,
  onSelect,
}: {
  options: Array<{ value: T; label: string }>;
  active: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          aria-pressed={active === option.value}
          className={`flex-1 rounded-sharp border py-1.5 font-num text-xs transition ${
            active === option.value
              ? 'border-chalk bg-key text-chalk'
              : 'border-rule text-dim hover:text-chalk'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetStats,
  onClose,
}) => {
  const update = (patch: Partial<GameSettings>) =>
    onUpdateSettings({ ...settings, ...patch });

  return (
    <Sheet
      title="Settings"
      onClose={onClose}
      footer={
        <SheetButton variant="primary" onClick={onClose}>
          Done
        </SheetButton>
      }
    >
      <section>
        <div className="flex items-center justify-between">
          <span className="text-sm text-chalk">Sound</span>
          <button
            role="switch"
            aria-checked={settings.soundEnabled}
            aria-label="Sound"
            onClick={() => update({ soundEnabled: !settings.soundEnabled })}
            className={`flex h-5 w-9 items-center rounded-full border p-0.5 transition-colors ${
              settings.soundEnabled ? 'border-race bg-race/25' : 'border-rule'
            }`}
          >
            <span
              className={`block h-3.5 w-3.5 rounded-full transition-transform ${
                settings.soundEnabled ? 'translate-x-4 bg-race' : 'bg-dim'
              }`}
            />
          </button>
        </div>

        {settings.soundEnabled && (
          <div className="mt-3 flex items-center gap-3">
            <span className="label">Volume</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              aria-label="Volume"
              value={settings.soundVolume}
              onChange={(e) => update({ soundVolume: parseFloat(e.target.value) })}
              style={{ accentColor: 'var(--race)' }}
              className="w-full cursor-pointer"
            />
          </div>
        )}
      </section>

      <section className="mt-6">
        <span className="label">Timed run length</span>
        <div className="mt-2">
          <Choice
            options={[30, 60, 90].map((value) => ({ value, label: `${value}s` }))}
            active={settings.timerDuration}
            onSelect={(value) => update({ timerDuration: value })}
          />
        </div>
      </section>

      <section className="mt-6">
        <span className="label">Sprint length</span>
        <div className="mt-2">
          <Choice
            options={[10, 20, 50].map((value) => ({ value, label: `${value} roots` }))}
            active={settings.sprintTarget}
            onSelect={(value) => update({ sprintTarget: value })}
          />
        </div>
      </section>

      <section className="mt-6">
        <span className="label">Surface</span>
        <div className="mt-2 divide-y divide-rule border-y border-rule">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => update({ theme: theme.id })}
              aria-pressed={settings.theme === theme.id}
              className="flex w-full items-center justify-between py-2.5 text-left"
            >
              <span>
                <span
                  className={`block text-sm ${
                    settings.theme === theme.id ? 'text-chalk' : 'text-dim'
                  }`}
                >
                  {theme.name}
                </span>
                <span className="block text-xs text-dim">{theme.note}</span>
              </span>
              {settings.theme === theme.id && (
                <span className="label text-race">Active</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SheetButton
          variant="danger"
          onClick={() => {
            if (confirm('Reset every record and run history?')) onResetStats();
          }}
        >
          Reset records
        </SheetButton>
      </section>
    </Sheet>
  );
};
