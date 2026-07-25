import React, { useState } from 'react';
import { Zap, Timer, Heart, Sparkles, BookOpen, Trophy, Settings } from 'lucide-react';
import { GameMode, UserStats, GameDifficulty } from '../types';

interface MainMenuProps {
  stats: UserStats;
  onStartGame: (mode: GameMode, difficulty?: GameDifficulty) => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  stats,
  onStartGame,
  onOpenRules,
  onOpenStats,
  onOpenSettings,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('medium');

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-4 flex-1">
      
      {/* 1. Hero Section */}
      <div className="w-full flex flex-col items-center justify-center space-y-3 shrink-0 py-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-500 flex items-center justify-center font-black text-slate-950 text-4xl shadow-lg shadow-sky-500/20">
          ∑
        </div>
        <div className="text-center">
          <h1 className="font-extrabold text-3xl tracking-wide text-white">
            DIGIT ROOT DASH
          </h1>
          <p className="text-sm text-slate-400 font-mono tracking-wider uppercase mt-1">Math Speed Game</p>
        </div>
      </div>

      {/* 2. Select Mode Section */}
      <div className="w-full flex-1 flex flex-col justify-end min-h-[220px]">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1 block mb-3 text-center">Swipe to select mode</span>

        <div className="-mx-4 flex overflow-x-auto space-x-4 pb-6 snap-x snap-mandatory hide-scrollbar items-center px-[10%] sm:px-[15%]">
          
          {/* Timed Attack */}
          <div className="snap-center shrink-0 w-full max-w-[280px] p-5 rounded-3xl bg-blue-600 shadow-xl shadow-blue-900/20 border border-blue-500/50 flex flex-col min-h-[180px]">
            <div className="flex justify-between items-start mb-auto">
              <div className="p-2.5 rounded-xl bg-black/20 text-white">
                <Zap size={28} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2.5 py-1 rounded-lg border border-white/20">
                60s
              </span>
            </div>
            <div className="pt-4">
              <div className="text-xl font-extrabold mb-1 text-white">Timed Attack</div>
              <div className="text-xs text-blue-100 font-normal mb-4">Score as much as possible in 60s</div>
              <button
                onClick={() => onStartGame('timed')}
                className="w-full py-3 rounded-xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition active:scale-95 shadow-md"
              >
                Play Mode
              </button>
            </div>
          </div>

          {/* Sprint Challenge */}
          <div className="snap-center shrink-0 w-full max-w-[280px] p-5 rounded-3xl bg-emerald-600 shadow-xl shadow-emerald-900/20 border border-emerald-500/50 flex flex-col min-h-[180px]">
            <div className="flex justify-between items-start mb-auto">
              <div className="p-2.5 rounded-xl bg-black/20 text-white">
                <Timer size={28} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2.5 py-1 rounded-lg border border-white/20">
                20 Solves
              </span>
            </div>
            <div className="pt-4">
              <div className="text-xl font-extrabold mb-1 text-white">Sprint Challenge</div>
              <div className="text-xs text-emerald-100 font-normal mb-4">Solve 20 numbers fast</div>
              <button
                onClick={() => onStartGame('sprint')}
                className="w-full py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition active:scale-95 shadow-md"
              >
                Play Mode
              </button>
            </div>
          </div>

          {/* Survival Mode */}
          <div className="snap-center shrink-0 w-full max-w-[280px] p-5 rounded-3xl bg-rose-600 shadow-xl shadow-rose-900/20 border border-rose-500/50 flex flex-col min-h-[180px]">
            <div className="flex justify-between items-start mb-auto">
              <div className="p-2.5 rounded-xl bg-black/20 text-white">
                <Heart size={28} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2.5 py-1 rounded-lg border border-white/20">
                3 Lives
              </span>
            </div>
            <div className="pt-4">
              <div className="text-xl font-extrabold mb-1 text-white">Survival Mode</div>
              <div className="text-xs text-rose-100 font-normal mb-4">3 lives, increasing length</div>
              <button
                onClick={() => onStartGame('survival')}
                className="w-full py-3 rounded-xl bg-white text-rose-900 font-bold text-sm hover:bg-rose-50 transition active:scale-95 shadow-md"
              >
                Play Mode
              </button>
            </div>
          </div>

          {/* Zen Practice */}
          <div className="snap-center shrink-0 w-full max-w-[280px] p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col min-h-[180px]">
            <div className="flex justify-between items-start mb-auto">
              <div className="p-2.5 rounded-xl bg-white/10 text-amber-400">
                <Sparkles size={28} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-black/20 px-2.5 py-1 rounded-lg border border-white/20 text-slate-300">
                Untimed
              </span>
            </div>
            <div className="pt-4">
              <div className="text-xl font-extrabold mb-2 text-white">Zen Practice</div>
              <div className="grid grid-cols-4 gap-1 mb-3">
                {(['easy', 'medium', 'hard', 'master'] as GameDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-1.5 text-[10px] font-bold rounded-lg capitalize transition border ${
                      selectedDifficulty === diff
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                        : 'bg-white/10 text-slate-300 border-white/10 hover:bg-white/20'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onStartGame('zen', selectedDifficulty)}
                className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition active:scale-95 shadow-md"
              >
                Start Practice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Section */}
      <div className="w-full grid grid-cols-4 gap-2 pt-4 mt-auto shrink-0">
        <button
          onClick={onOpenStats}
          className="col-span-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 transition border border-white/10 flex flex-col items-center justify-center space-y-1"
        >
          <Trophy size={20} />
          <span className="text-[9px] uppercase font-bold tracking-wider">Stats</span>
        </button>

        <button
          onClick={onOpenRules}
          className="col-span-2 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-sky-300 hover:text-sky-200 transition border border-white/10 flex flex-col items-center justify-center space-y-1"
        >
          <BookOpen size={20} />
          <span className="text-[9px] uppercase font-bold tracking-wider">How to Play</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="col-span-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10 flex flex-col items-center justify-center space-y-1"
        >
          <Settings size={20} />
          <span className="text-[9px] uppercase font-bold tracking-wider">Settings</span>
        </button>
      </div>
    </div>
  );
};
