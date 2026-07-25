import React, { useState } from 'react';
import { BarChart3, X, Trophy, Flame, CheckCircle, Clock, History } from 'lucide-react';
import { UserStats, GameHistoryItem } from '../types';

interface StatsModalProps {
  stats: UserStats;
  history: GameHistoryItem[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, history, onClose }) => {
  const [activeTab, setActiveTab] = useState<'records' | 'history'>('records');

  return (
    <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
            <BarChart3 size={20} />
            <span>Statistics & Records</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('records')}
            className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1 ${
              activeTab === 'records' ? 'bg-sky-500 text-white shadow border border-white/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy size={14} />
            <span>Personal Bests</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1 ${
              activeTab === 'history' ? 'bg-sky-500 text-white shadow border border-white/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History size={14} />
            <span>History ({history.length})</span>
          </button>
        </div>

        {activeTab === 'records' ? (
          <div className="space-y-3">
            {/* Timed Attack Card */}
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex justify-between items-center backdrop-blur-md">
              <div>
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">⚡ Timed Attack</div>
                <div className="text-2xl font-black text-white font-mono">{stats.timed.highScore} <span className="text-xs text-slate-400 font-normal">pts</span></div>
              </div>
              <div className="text-right text-xs text-slate-300 space-y-0.5">
                <div>Max Streak: <span className="text-amber-300 font-bold">{stats.timed.maxStreak}🔥</span></div>
                <div>Solved: <span className="text-emerald-300 font-bold">{stats.timed.totalSolved}</span></div>
              </div>
            </div>

            {/* Sprint Challenge Card */}
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex justify-between items-center backdrop-blur-md">
              <div>
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">🚀 Sprint (20 Problems)</div>
                <div className="text-2xl font-black text-white font-mono">
                  {stats.sprint.fastestTime ? `${stats.sprint.fastestTime}s` : 'N/A'}
                </div>
              </div>
              <div className="text-right text-xs text-slate-300 space-y-0.5">
                <div>Max Streak: <span className="text-amber-300 font-bold">{stats.sprint.maxStreak}🔥</span></div>
                <div>Played: <span className="text-purple-300 font-bold">{stats.sprint.gamesPlayed}</span></div>
              </div>
            </div>

            {/* Survival Mode Card */}
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex justify-between items-center backdrop-blur-md">
              <div>
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">❤️ Survival Mode</div>
                <div className="text-2xl font-black text-white font-mono">{stats.survival.highScore} <span className="text-xs text-slate-400 font-normal">pts</span></div>
              </div>
              <div className="text-right text-xs text-slate-300 space-y-0.5">
                <div>Max Streak: <span className="text-amber-300 font-bold">{stats.survival.maxStreak}🔥</span></div>
                <div>Solved: <span className="text-emerald-300 font-bold">{stats.survival.totalSolved}</span></div>
              </div>
            </div>

            {/* Overall Totals */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-slate-300 flex justify-around text-center backdrop-blur-md">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Total Solved</span>
                <span className="text-emerald-300 font-bold text-base">
                  {stats.timed.totalSolved + stats.sprint.totalSolved + stats.survival.totalSolved + stats.zen.totalSolved}
                </span>
              </div>
              <div className="border-r border-white/10 h-8" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Total Career Pts</span>
                <span className="text-sky-300 font-bold text-base">{stats.totalPoints}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-6 font-mono">No game history yet. Play a round!</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex justify-between items-center backdrop-blur-md">
                  <div>
                    <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10">
                      {item.mode}
                    </span>
                    <div className="text-slate-400 text-[10px] mt-1 font-mono">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sky-300 font-bold text-sm">{item.score} pts</div>
                    <div className="text-slate-400 text-[10px]">
                      {item.solved} solved | {item.accuracy}% acc
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 font-bold text-slate-200 transition text-xs backdrop-blur-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};
