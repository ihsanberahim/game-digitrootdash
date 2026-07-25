import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Home, Flame, CheckCircle, Clock, Zap } from 'lucide-react';
import { GameMode } from '../types';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface GameOverModalProps {
  mode: GameMode;
  result: {
    score: number;
    solved: number;
    totalAttempts: number;
    maxStreak: number;
    timeTaken: number;
  };
  isNewHighScore?: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  mode,
  result,
  isNewHighScore = false,
  onPlayAgain,
  onHome,
}) => {
  const accuracy =
    result.totalAttempts > 0
      ? Math.round((result.solved / result.totalAttempts) * 100)
      : 100;

  const avgSpeed =
    result.solved > 0 ? (result.timeTaken / result.solved).toFixed(1) : '---';

  useEffect(() => {
    if (isNewHighScore || result.solved >= 10) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#10b981', '#f59e0b', '#ec4899'],
      });
    }
  }, [isNewHighScore, result.solved]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl space-y-5"
      >
        <div className="relative inline-block">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto text-3xl text-sky-300 backdrop-blur-md">
            {isNewHighScore ? '🏆' : result.solved >= 15 ? '🔥' : '⚡'}
          </div>
          {isNewHighScore && (
            <span className="absolute -top-2 -right-3 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full border border-amber-200 shadow">
              New Best!
            </span>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {mode === 'sprint' ? 'Sprint Complete!' : mode === 'survival' ? 'Out of Lives!' : 'Time\'s Up!'}
          </h3>
          <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-wider">
            {mode.toUpperCase()} MODE SUMMARY
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-1">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left backdrop-blur-md">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Final Score</span>
            <span className="text-2xl font-black text-sky-300 font-mono">{result.score}</span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left backdrop-blur-md">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Max Streak</span>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-black text-amber-300 font-mono">{result.maxStreak}</span>
              <Flame size={16} className="text-amber-400 fill-amber-400" />
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left backdrop-blur-md">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Solved</span>
            <div className="flex items-center space-x-1">
              <span className="text-xl font-black text-emerald-300 font-mono">{result.solved}</span>
              <CheckCircle size={14} className="text-emerald-400" />
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-left backdrop-blur-md">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Accuracy</span>
            <span className="text-xl font-black text-purple-300 font-mono">{accuracy}%</span>
          </div>
        </div>

        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs text-slate-300 font-mono flex justify-between items-center px-4 backdrop-blur-md">
          <span className="flex items-center space-x-1.5 text-slate-400">
            <Clock size={14} />
            <span>Avg Speed:</span>
          </span>
          <span className="font-bold text-amber-300">{avgSpeed}s / solve</span>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 font-black text-slate-950 transition shadow-lg shadow-sky-500/20 active:scale-95 text-base flex items-center justify-center space-x-2"
          >
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-bold text-slate-200 border border-white/10 transition text-sm flex items-center justify-center space-x-2 backdrop-blur-md"
          >
            <Home size={16} />
            <span>Main Menu</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
