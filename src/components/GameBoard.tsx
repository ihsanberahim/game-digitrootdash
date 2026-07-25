import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Heart, Lightbulb, RotateCcw, Eye, EyeOff, Zap } from 'lucide-react';
import { GameMode, GameDifficulty, GameSettings, StepBreakdown } from '../types';
import { computeDigitalRoot, generateRandomNumber, getDigitCountForProgression, getStepByStepBreakdown } from '../utils/math';
import { soundFx } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface GameBoardProps {
  mode: GameMode;
  difficulty?: GameDifficulty;
  settings: GameSettings;
  onFinishGame: (result: {
    score: number;
    solved: number;
    totalAttempts: number;
    maxStreak: number;
    timeTaken: number;
  }) => void;
  onQuit: () => void;
  onOpenHint: (breakdown: StepBreakdown) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  mode,
  difficulty = 'medium',
  settings,
  onFinishGame,
  onQuit,
  onOpenHint,
}) => {
  // Game state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [lives, setLives] = useState(3);

  // Timers
  const [timeRemaining, setTimeRemaining] = useState(
    mode === 'timed' ? settings.timerDuration : 0
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  // Current problem state
  const [currentNumber, setCurrentNumber] = useState('');
  const [targetRoot, setTargetRoot] = useState(0);
  const [stepBreakdown, setStepBreakdown] = useState<StepBreakdown | null>(null);

  // UI state
  const [showCastingOut, setShowCastingOut] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('Tap the single-digit answer below (0–9)');
  const [feedbackType, setFeedbackType] = useState<'neutral' | 'correct' | 'wrong'>('neutral');
  const [floatingPops, setFloatingPops] = useState<Array<{ id: number; text: string; color: string }>>([]);
  const [cardStatus, setCardStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Generate new number
  const spawnNumber = useCallback(() => {
    const digitCount = getDigitCountForProgression(solvedCount, difficulty);
    const numStr = generateRandomNumber(digitCount);
    const root = computeDigitalRoot(numStr);
    const breakdown = getStepByStepBreakdown(numStr);

    setCurrentNumber(numStr);
    setTargetRoot(root);
    setStepBreakdown(breakdown);
    setFeedbackMsg('Tap the single-digit answer below');
    setFeedbackType('neutral');
    setCardStatus('idle');
  }, [solvedCount, difficulty]);

  // Initial spawn
  useEffect(() => {
    spawnNumber();
  }, [spawnNumber]);

  // Timers Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (mode === 'timed') {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            finishCurrentGame();
            return 0;
          }
          if (prev <= 10) soundFx.playTick(true);
          return prev - 1;
        });
      }, 1000);
    } else if (mode === 'sprint' || mode === 'survival' || mode === 'zen') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode]);

  const finishCurrentGame = useCallback(() => {
    soundFx.playFanfare();
    const timeTaken = mode === 'timed' ? settings.timerDuration - timeRemaining : elapsedTime;
    onFinishGame({
      score,
      solved: solvedCount,
      totalAttempts,
      maxStreak,
      timeTaken,
    });
  }, [mode, settings.timerDuration, timeRemaining, elapsedTime, score, solvedCount, totalAttempts, maxStreak, onFinishGame]);

  // Floating text trigger
  const triggerPop = (text: string, color: string) => {
    const id = Date.now() + Math.random();
    setFloatingPops((prev) => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingPops((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  // Submit Answer handler
  const handleAnswer = useCallback(
    (digit: number) => {
      setTotalAttempts((prev) => prev + 1);

      if (digit === targetRoot) {
        // Correct!
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > maxStreak) setMaxStreak(newStreak);

        const streakBonus = Math.min(newStreak * 20, 100);
        const addedScore = 100 + streakBonus;
        setScore((prev) => prev + addedScore);

        const newSolved = solvedCount + 1;
        setSolvedCount(newSolved);

        // Audio & Visual FX
        if (newStreak > 1 && newStreak % 3 === 0) {
          soundFx.playCombo();
          triggerPop(`${newStreak}x COMBO! 🔥`, 'text-amber-400 font-extrabold');
        } else {
          soundFx.playCorrect(newStreak);
        }

        soundFx.triggerHaptics(40);
        setCardStatus('correct');
        setFeedbackMsg(`Correct! +${addedScore} pts`);
        setFeedbackType('correct');
        triggerPop(`+${addedScore}`, 'text-emerald-400 font-bold');

        // Check Sprint mode win condition
        if (mode === 'sprint' && newSolved >= settings.sprintTarget) {
          setTimeout(() => {
            finishCurrentGame();
          }, 300);
          return;
        }

        // Spawn next problem
        setTimeout(() => {
          spawnNumber();
        }, 150);
      } else {
        // Incorrect!
        setStreak(0);
        soundFx.playWrong();
        soundFx.triggerHaptics([80, 50, 80]);
        setCardStatus('wrong');
        setFeedbackMsg(`Incorrect! Try again.`);
        setFeedbackType('wrong');
        triggerPop(`Wrong!`, 'text-rose-400 font-bold');

        if (mode === 'survival') {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives <= 0) {
            setTimeout(() => {
              finishCurrentGame();
            }, 400);
            return;
          }
        }

        setTimeout(() => {
          setCardStatus('idle');
        }, 400);
      }
    },
    [targetRoot, streak, maxStreak, solvedCount, mode, settings.sprintTarget, lives, spawnNumber, finishCurrentGame]
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        handleAnswer(parseInt(e.key, 10));
      } else if (e.key === 'h' || e.key === 'H') {
        if (stepBreakdown) onOpenHint(stepBreakdown);
      } else if (e.key === 'Escape') {
        onQuit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer, stepBreakdown, onOpenHint, onQuit]);

  // Render numbers with optional "Casting Out 9s" highlight
  const renderNumberDigits = () => {
    if (!showCastingOut || !stepBreakdown) {
      return (
        <span className="text-4xl sm:text-5xl font-black text-white tracking-widest font-mono break-all">
          {currentNumber}
        </span>
      );
    }

    const { cancelledDigits } = stepBreakdown.castingOutNines;

    return (
      <div className="flex flex-wrap justify-center gap-1 my-1">
        {currentNumber.split('').map((char, idx) => {
          const isCancelled = cancelledDigits.includes(idx);
          return (
            <span
              key={idx}
              className={`text-3xl sm:text-4xl font-mono font-black transition-all duration-300 px-1 rounded ${
                isCancelled
                  ? 'text-slate-600 line-through opacity-40 bg-slate-900/40 scale-90'
                  : 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between py-2 space-y-4 relative">
      {/* HUD Bar */}
      <div className="w-full flex justify-between items-center bg-white/5 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-lg">
        {mode === 'survival' ? (
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Lives</span>
            <div className="flex space-x-1 mt-0.5">
              {[1, 2, 3].map((heartIdx) => (
                <Heart
                  key={heartIdx}
                  size={18}
                  className={heartIdx <= lives ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-slate-600'}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Score</span>
            <span className="text-2xl font-black text-sky-300 font-mono">{score}</span>
          </div>
        )}

        <div className="text-center">
          {mode === 'timed' && (
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Timer</span>
              <span
                className={`text-2xl font-black font-mono transition-colors ${
                  timeRemaining <= 10 ? 'text-rose-400 animate-pulse' : 'text-emerald-300'
                }`}
              >
                {timeRemaining}s
              </span>
            </div>
          )}
          {mode === 'sprint' && (
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                Solved ({solvedCount}/{settings.sprintTarget})
              </span>
              <span className="text-2xl font-black text-emerald-300 font-mono">{elapsedTime}s</span>
            </div>
          )}
          {(mode === 'survival' || mode === 'zen') && (
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Solved</span>
              <span className="text-2xl font-black text-purple-300 font-mono">{solvedCount}</span>
            </div>
          )}
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Streak</span>
          <div className="flex items-center justify-end space-x-1">
            <span className="text-2xl font-black text-amber-300 font-mono">{streak}</span>
            <Flame size={18} className={streak > 0 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-600'} />
          </div>
        </div>
      </div>

      {/* Floating Pops Container */}
      <div className="absolute top-16 left-0 right-0 pointer-events-none flex flex-col items-center z-20">
        <AnimatePresence>
          {floatingPops.map((pop) => (
            <motion.div
              key={pop.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -40, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`text-lg font-mono ${pop.color} drop-shadow-md`}
            >
              {pop.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Active Number Display Card */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[180px]">
        <motion.div
          animate={
            cardStatus === 'correct'
              ? { scale: [1, 1.04, 1], borderColor: '#10b981' }
              : cardStatus === 'wrong'
              ? { x: [-10, 10, -8, 8, 0], borderColor: '#f43f5e' }
              : { scale: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }
          }
          transition={{ duration: 0.3 }}
          className="w-full py-6 px-4 bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="w-full flex justify-between items-center px-2 mb-2">
            <span className="text-[10px] text-slate-300 uppercase tracking-widest font-mono font-semibold">
              Reduce To Single Digit
            </span>
            <button
              onClick={() => setShowCastingOut(!showCastingOut)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center space-x-1 transition ${
                showCastingOut
                  ? 'bg-amber-400/30 text-amber-200 border border-amber-400/50'
                  : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
              title="Toggle 'Casting out 9s' visual cancellation mode"
            >
              {showCastingOut ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>Cast 9s</span>
            </button>
          </div>

          <div className="py-2">{renderNumberDigits()}</div>

          <div className="mt-1 h-5 flex items-center justify-center">
            <span
              className={`text-xs font-semibold font-mono transition-colors ${
                feedbackType === 'correct'
                  ? 'text-emerald-300'
                  : feedbackType === 'wrong'
                  ? 'text-rose-300'
                  : 'text-slate-300'
              }`}
            >
              {feedbackMsg}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Custom Touch Numpad */}
      <div className="w-full space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleAnswer(num)}
              className="py-4 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 active:bg-blue-600/80 active:text-white font-black text-2xl text-slate-100 shadow-md backdrop-blur-lg font-mono transition"
            >
              {num}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onQuit}
            className="py-3 rounded-2xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-rose-300 font-bold text-xs transition backdrop-blur-md flex items-center justify-center space-x-1"
          >
            <RotateCcw size={14} />
            <span>Quit</span>
          </button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => handleAnswer(0)}
            className="py-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 active:bg-blue-600/80 active:text-white font-black text-2xl text-slate-100 shadow-md backdrop-blur-lg font-mono transition"
          >
            0
          </motion.button>

          <button
            onClick={() => stepBreakdown && onOpenHint(stepBreakdown)}
            className="py-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 text-amber-300 font-bold text-xs transition backdrop-blur-md flex items-center justify-center space-x-1"
          >
            <Lightbulb size={14} />
            <span>Hint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
