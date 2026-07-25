import React from 'react';
import { Settings, X, Volume2, VolumeX, Smartphone, RotateCcw, Palette } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetStats: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetStats,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-slate-200 font-bold text-base">
            <Settings size={20} className="text-sky-300" />
            <span>Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          {/* Audio Settings */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                {settings.soundEnabled ? <Volume2 size={16} className="text-sky-300" /> : <VolumeX size={16} className="text-slate-500" />}
                <span>Sound Effects</span>
              </span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </div>

            {settings.soundEnabled && (
              <div className="flex items-center space-x-3 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] uppercase font-mono text-slate-400">Vol</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={settings.soundVolume}
                  onChange={(e) => onUpdateSettings({ ...settings, soundVolume: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Timed Attack Duration */}
          <div className="space-y-1.5 border-t border-white/10 pt-3">
            <label className="font-bold text-slate-200 block">Timed Attack Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 60, 90].map((dur) => (
                <button
                  key={dur}
                  onClick={() => onUpdateSettings({ ...settings, timerDuration: dur })}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    settings.timerDuration === dur
                      ? 'bg-sky-500 text-white border-sky-400 font-extrabold shadow-md'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          {/* Sprint Target */}
          <div className="space-y-1.5 border-t border-white/10 pt-3">
            <label className="font-bold text-slate-200 block">Sprint Target Problems</label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 50].map((count) => (
                <button
                  key={count}
                  onClick={() => onUpdateSettings({ ...settings, sprintTarget: count })}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    settings.sprintTarget === count
                      ? 'bg-emerald-500 text-white border-emerald-400 font-extrabold shadow-md'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {count} Problems
                </button>
              ))}
            </div>
          </div>

          {/* Theme Palette */}
          <div className="space-y-1.5 border-t border-white/10 pt-3">
            <label className="font-bold text-slate-200 block flex items-center space-x-1.5">
              <Palette size={14} className="text-purple-300" />
              <span>Theme Appearance</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dark', label: 'Frosted Glass' },
                { id: 'neon', label: 'Cyber Neon' },
                { id: 'midnight', label: 'Midnight Blue' },
                { id: 'light', label: 'Slate Dark' },
              ].map((themeItem) => (
                <button
                  key={themeItem.id}
                  onClick={() => onUpdateSettings({ ...settings, theme: themeItem.id as any })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border text-left ${
                    settings.theme === themeItem.id
                      ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {themeItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Stats */}
          <div className="border-t border-white/10 pt-3">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all game statistics and high scores?')) {
                  onResetStats();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 font-bold transition text-xs flex items-center justify-center space-x-1.5 backdrop-blur-md"
            >
              <RotateCcw size={14} />
              <span>Reset Statistics</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 font-bold text-slate-200 transition text-xs backdrop-blur-md"
        >
          Done
        </button>
      </div>
    </div>
  );
};
