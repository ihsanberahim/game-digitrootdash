import { useState, useEffect } from 'react';
import {
  GameMode,
  GameDifficulty,
  GameSettings,
  UserStats,
  GameHistoryItem,
  GameSessionResult,
  StepBreakdown,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadUserStats,
  saveUserStats,
  loadGameHistory,
  saveGameHistory,
  clearGameHistory,
  defaultStats,
} from './utils/storage';
import { calculateAccuracy } from './utils/game';
import { soundFx } from './utils/audio';

import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { GameOverModal } from './components/GameOverModal';
import { HintModal } from './components/HintModal';
import { StatsModal } from './components/StatsModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';

type GameResultView = GameSessionResult & { isNewHighScore: boolean };

export default function App() {
  const [view, setView] = useState<'menu' | 'playing'>('menu');
  const [activeMode, setActiveMode] = useState<GameMode>('timed');
  const [activeDifficulty, setActiveDifficulty] = useState<GameDifficulty>('medium');
  const [gameSession, setGameSession] = useState(0);

  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [history, setHistory] = useState<GameHistoryItem[]>(loadGameHistory);

  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeHint, setActiveHint] = useState<StepBreakdown | null>(null);
  const [lastGameResult, setLastGameResult] = useState<GameResultView | null>(null);

  const menuShortcutBlocked = showRules || showStats || showSettings;

  useEffect(() => {
    soundFx.setSoundEnabled(settings.soundEnabled);
    soundFx.setVolume(settings.soundVolume);
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  function handleStartGame(mode: GameMode, difficulty: GameDifficulty = 'medium') {
    soundFx.playClick();
    setShowRules(false);
    setShowStats(false);
    setShowSettings(false);
    setActiveHint(null);
    setActiveMode(mode);
    setActiveDifficulty(difficulty);
    setGameSession((session) => session + 1);
    setLastGameResult(null);
    setView('playing');
  }

  function handleFinishGame(result: GameSessionResult) {
    const currentModeStats = stats[activeMode];
    const isNewHighScore =
      activeMode === 'sprint'
        ? !currentModeStats.fastestTime || result.timeTaken < currentModeStats.fastestTime
        : result.score > currentModeStats.highScore;

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

    const newHistory = saveGameHistory({
      mode: activeMode,
      score: result.score,
      solved: result.solved,
      accuracy: calculateAccuracy(result.solved, result.totalAttempts),
      maxStreak: result.maxStreak,
    });
    setHistory(newHistory);
    setLastGameResult({ ...result, isNewHighScore });
  }

  function handleResetStats() {
    setStats(defaultStats);
    saveUserStats(defaultStats);
    clearGameHistory();
    setHistory([]);
  }

  return (
    <div className="no-select flex min-h-[100dvh] flex-col text-chalk antialiased">
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-5 pt-5">
        {view === 'menu' ? (
          <MainMenu
            stats={stats}
            settings={settings}
            onStartGame={handleStartGame}
            onOpenRules={() => setShowRules(true)}
            onOpenStats={() => setShowStats(true)}
            onOpenSettings={() => setShowSettings(true)}
            shortcutBlocked={menuShortcutBlocked}
          />
        ) : (
          <GameBoard
            key={gameSession}
            mode={activeMode}
            difficulty={activeDifficulty}
            settings={settings}
            gameEnded={Boolean(lastGameResult)}
            inputLocked={Boolean(lastGameResult || activeHint)}
            onFinishGame={handleFinishGame}
            onQuit={() => setView('menu')}
            onOpenHint={(breakdown) => setActiveHint(breakdown)}
          />
        )}

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

        {activeHint && (
          <HintModal breakdown={activeHint} onClose={() => setActiveHint(null)} />
        )}

        {showRules && <RulesModal onClose={() => setShowRules(false)} />}

        {showStats && (
          <StatsModal
            stats={stats}
            history={history}
            onClose={() => setShowStats(false)}
          />
        )}

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
  );
}
