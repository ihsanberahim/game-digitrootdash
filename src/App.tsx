import React, { useState, useEffect } from 'react';
import { GameMode, GameDifficulty, GameSettings, UserStats, GameHistoryItem, StepBreakdown } from './types';
import {
  loadSettings,
  saveSettings,
  loadUserStats,
  saveUserStats,
  loadGameHistory,
  saveGameHistory,
  defaultStats,
} from './utils/storage';
import { soundFx } from './utils/audio';

import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { GameOverModal } from './components/GameOverModal';
import { HintModal } from './components/HintModal';
import { StatsModal } from './components/StatsModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { motion } from 'motion/react';

export default function App() {
  // Application view: 'menu' | 'playing'
  const [view, setView] = useState<'menu' | 'playing'>('menu');

  // Active game configuration
  const [activeMode, setActiveMode] = useState<GameMode>('timed');
  const [activeDifficulty, setActiveDifficulty] = useState<GameDifficulty>('medium');

  // Persistent State
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [history, setHistory] = useState<GameHistoryItem[]>(loadGameHistory);

  // Modals
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeHint, setActiveHint] = useState<StepBreakdown | null>(null);

  // Completed game result for GameOverModal
  const [lastGameResult, setLastGameResult] = useState<{
    score: number;
    solved: number;
    totalAttempts: number;
    maxStreak: number;
    timeTaken: number;
    isNewHighScore: boolean;
  } | null>(null);

  // Audio configuration synchronization
  useEffect(() => {
    soundFx.setSoundEnabled(settings.soundEnabled);
    soundFx.setVolume(settings.soundVolume);
    saveSettings(settings);
  }, [settings]);

  // Update theme class on root html or app container
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'neon':
        return 'bg-[#050814] text-cyan-100 selection:bg-cyan-500';
      case 'midnight':
        return 'bg-[#0a0c1a] text-indigo-100 selection:bg-indigo-500';
      case 'light':
        return 'bg-slate-900 text-slate-100 selection:bg-sky-500';
      case 'dark':
      default:
        return 'bg-[#0a0a0f] text-slate-100 selection:bg-sky-500';
    }
  };

  // Sound toggle helper
  const handleToggleSound = () => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Start game handler
  const handleStartGame = (mode: GameMode, difficulty: GameDifficulty = 'medium') => {
    soundFx.playClick();
    setActiveMode(mode);
    setActiveDifficulty(difficulty);
    setLastGameResult(null);
    setView('playing');
  };

  // Finish game handler
  const handleFinishGame = (result: {
    score: number;
    solved: number;
    totalAttempts: number;
    maxStreak: number;
    timeTaken: number;
  }) => {
    let isNewHighScore = false;

    // Check if score or time is personal best
    const currentModeStats = stats[activeMode];

    if (activeMode === 'sprint') {
      const currentFastest = currentModeStats.fastestTime;
      if (!currentFastest || result.timeTaken < currentFastest) {
        isNewHighScore = true;
      }
    } else {
      if (result.score > currentModeStats.highScore) {
        isNewHighScore = true;
      }
    }

    // Update stats
    const updatedModeStats = {
      ...currentModeStats,
      highScore: Math.max(currentModeStats.highScore, result.score),
      fastestTime:
        activeMode === 'sprint'
          ? Math.min(currentModeStats.fastestTime || 9999, result.timeTaken)
          : currentModeStats.fastestTime,
      maxStreak: Math.max(currentModeStats.maxStreak, result.maxStreak),
      totalSolved: currentModeStats.totalSolved + result.solved,
      totalAttempts: currentModeStats.totalAttempts + result.totalAttempts,
      gamesPlayed: currentModeStats.gamesPlayed + 1,
    };

    const newStats: UserStats = {
      ...stats,
      [activeMode]: updatedModeStats,
      totalPoints: stats.totalPoints + result.score,
    };

    setStats(newStats);
    saveUserStats(newStats);

    // Save game to history
    const accuracy =
      result.totalAttempts > 0
        ? Math.round((result.solved / result.totalAttempts) * 100)
        : 100;

    const newHistory = saveGameHistory({
      mode: activeMode,
      score: result.score,
      solved: result.solved,
      accuracy,
      maxStreak: result.maxStreak,
    });
    setHistory(newHistory);

    setLastGameResult({
      ...result,
      isNewHighScore,
    });
  };

  // Reset stats
  const handleResetStats = () => {
    setStats(defaultStats);
    saveUserStats(defaultStats);
    localStorage.removeItem('digit_root_dash_history_v1');
    setHistory([]);
  };

  return (
    <div className={`min-h-screen h-full flex flex-col font-sans antialiased no-select relative overflow-hidden ${getThemeClass()}`}>
      {/* Ambient Frosted Glass Background Orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, 30, -30, 30, 0],
          scale: [1, 1.1, 1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-purple-900/30 blur-[120px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          x: [0, -40, 40, -40, 0],
          y: [0, -50, 0, 50, 0],
          scale: [1, 0.9, 1.1, 1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-blue-900/30 blur-[120px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          x: [0, 30, -30, 30, 0],
          y: [0, -30, 30, -30, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed top-[30%] right-[5%] w-[40%] h-[40%] rounded-full bg-emerald-900/20 blur-[100px] pointer-events-none z-0"
      />

      <div className="relative z-10 flex flex-col min-h-screen h-full">
        <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col justify-between items-center relative">
          {view === 'menu' ? (
            <MainMenu
              stats={stats}
              settings={settings}
              onStartGame={handleStartGame}
              onOpenRules={() => setShowRules(true)}
              onOpenStats={() => setShowStats(true)}
              onOpenSettings={() => setShowSettings(true)}
              onToggleSound={handleToggleSound}
            />
          ) : (
            <GameBoard
              mode={activeMode}
              difficulty={activeDifficulty}
              settings={settings}
              onFinishGame={handleFinishGame}
              onQuit={() => setView('menu')}
              onOpenHint={(breakdown) => setActiveHint(breakdown)}
            />
          )}

          {/* Game Over Modal */}
          {lastGameResult && (
            <GameOverModal
              mode={activeMode}
              result={lastGameResult}
              isNewHighScore={lastGameResult.isNewHighScore}
              onPlayAgain={() => handleStartGame(activeMode, activeDifficulty)}
              onHome={() => {
                setLastGameResult(null);
                setView('menu');
              }}
            />
          )}

          {/* Hint Modal */}
          {activeHint && (
            <HintModal
              breakdown={activeHint}
              onClose={() => setActiveHint(null)}
            />
          )}

          {/* Rules Modal */}
          {showRules && <RulesModal onClose={() => setShowRules(false)} />}

          {/* Stats Modal */}
          {showStats && (
            <StatsModal
              stats={stats}
              history={history}
              onClose={() => setShowStats(false)}
            />
          )}

          {/* Settings Modal */}
          {showSettings && (
            <SettingsModal
              settings={settings}
              onUpdateSettings={setSettings}
              onResetStats={handleResetStats}
              onClose={() => setShowSettings(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
