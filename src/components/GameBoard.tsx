import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  GameMode,
  GameDifficulty,
  GameSettings,
  GameSessionResult,
  StepBreakdown,
} from '../types';
import {
  computeDigitalRoot,
  generateRandomNumber,
  getDigitCountForProgression,
  getStepByStepBreakdown,
} from '../utils/math';
import { soundFx } from '../utils/audio';
import {
  calculateTimeTaken,
  shouldFinishOnQuit,
  shouldHandleGameKey,
} from '../utils/game';
import { DigitStrip, RootLine } from './DigitStrip';

interface GameBoardProps {
  mode: GameMode;
  difficulty?: GameDifficulty;
  settings: GameSettings;
  gameEnded?: boolean;
  inputLocked?: boolean;
  onFinishGame: (result: GameSessionResult) => void;
  onQuit: () => void;
  onOpenHint: (breakdown: StepBreakdown) => void;
}

const RESOLVE_MS = 340;

const KEY_CLASS =
  'rounded-sharp border border-rule bg-key font-num text-2xl font-bold tnum text-chalk transition-colors hover:border-chalk active:bg-chalk active:text-ink';

const FEEDBACK_TONE: Record<'neutral' | 'correct' | 'wrong', string> = {
  neutral: 'text-dim',
  correct: 'text-alive',
  wrong: 'text-strike',
};

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}`;
}

function shakeOffset(shake: number): number | number[] {
  if (shake === 0) return 0;
  if (shake % 2 === 0) return [0, -8, 8, -5, 5, 0];
  return [0, 8, -8, 5, -5, 0];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  mode,
  difficulty = 'medium',
  settings,
  gameEnded = false,
  inputLocked = false,
  onFinishGame,
  onQuit,
  onOpenHint,
}) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [lives, setLives] = useState(3);

  const [timeRemaining, setTimeRemaining] = useState(
    mode === 'timed' ? settings.timerDuration : 0,
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  const [currentNumber, setCurrentNumber] = useState('');
  const [targetRoot, setTargetRoot] = useState(0);
  const [stepBreakdown, setStepBreakdown] = useState<StepBreakdown | null>(null);

  const [assist, setAssist] = useState(false);
  const [phase, setPhase] = useState<'solving' | 'resolved'>('solving');
  const [feedback, setFeedback] = useState('Tap the single-digit root');
  const [feedbackTone, setFeedbackTone] = useState<'neutral' | 'correct' | 'wrong'>(
    'neutral',
  );
  const [pops, setPops] = useState<Array<{ id: number; text: string; tone: string }>>(
    [],
  );
  const [wrongShake, setWrongShake] = useState(0);
  const hasFinishedRef = useRef(false);

  const spawnNumber = useCallback(
    (solved: number) => {
      const digitCount = getDigitCountForProgression(solved, difficulty);
      const numStr = generateRandomNumber(digitCount);
      setCurrentNumber(numStr);
      setTargetRoot(computeDigitalRoot(numStr));
      setStepBreakdown(getStepByStepBreakdown(numStr));
      setPhase('solving');
      setFeedback('Tap the single-digit root');
      setFeedbackTone('neutral');
    },
    [difficulty],
  );

  useEffect(() => {
    spawnNumber(0);
  }, [spawnNumber]);

  const finishCurrentGame = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    soundFx.playFanfare();
    onFinishGame({
      score,
      solved: solvedCount,
      totalAttempts,
      maxStreak,
      timeTaken: calculateTimeTaken(
        mode,
        settings.timerDuration,
        timeRemaining,
        elapsedTime,
      ),
    });
  }, [
    mode,
    settings.timerDuration,
    timeRemaining,
    elapsedTime,
    score,
    solvedCount,
    totalAttempts,
    maxStreak,
    onFinishGame,
  ]);

  // Interval reads the latest finisher through a ref to avoid stale score.
  const finishRef = useRef(finishCurrentGame);
  useEffect(() => {
    finishRef.current = finishCurrentGame;
  }, [finishCurrentGame]);

  useEffect(() => {
    if (gameEnded) return;

    if (mode === 'timed') {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishRef.current();
            return 0;
          }
          if (prev <= 10) soundFx.playTick(true);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [gameEnded, mode]);

  function triggerPop(text: string, tone: string) {
    const id = Date.now() + Math.random();
    setPops((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => setPops((prev) => prev.filter((p) => p.id !== id)), 900);
  }

  const quitOrEnd = useCallback(() => {
    if (shouldFinishOnQuit(mode)) finishRef.current();
    else onQuit();
  }, [mode, onQuit]);

  const handleAnswer = useCallback(
    (digit: number) => {
      if (phase === 'resolved') return;
      setTotalAttempts((prev) => prev + 1);

      if (digit === targetRoot) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak((prev) => Math.max(prev, newStreak));

        const addedScore = 100 + Math.min(newStreak * 20, 100);
        setScore((prev) => prev + addedScore);
        const newSolved = solvedCount + 1;
        setSolvedCount(newSolved);

        if (newStreak > 1 && newStreak % 3 === 0) {
          soundFx.playCombo();
          triggerPop(`${newStreak}× combo`, 'text-race');
        } else {
          soundFx.playCorrect(newStreak);
        }
        soundFx.triggerHaptics(40);
        triggerPop(`+${addedScore}`, 'text-alive');

        setPhase('resolved');
        setFeedback(`Cast out — root ${targetRoot}`);
        setFeedbackTone('correct');

        if (mode === 'sprint' && newSolved >= settings.sprintTarget) {
          setTimeout(() => finishRef.current(), RESOLVE_MS);
          return;
        }
        setTimeout(() => spawnNumber(newSolved), RESOLVE_MS);
        return;
      }

      setStreak(0);
      soundFx.playWrong();
      soundFx.triggerHaptics([80, 50, 80]);
      setWrongShake((n) => n + 1);
      setFeedback('Not the root — keep reducing');
      setFeedbackTone('wrong');

      if (mode === 'survival') {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setPhase('resolved');
          setTimeout(() => finishRef.current(), 500);
        }
      }
    },
    [
      phase,
      targetRoot,
      streak,
      solvedCount,
      mode,
      settings.sprintTarget,
      lives,
      spawnNumber,
    ],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!shouldHandleGameKey(e.key, e.repeat, inputLocked)) return;
      if (/^[0-9]$/.test(e.key)) {
        handleAnswer(parseInt(e.key, 10));
      } else if (e.key.toLowerCase() === 'h') {
        if (stepBreakdown) onOpenHint(stepBreakdown);
      } else if (e.key === 'Escape') {
        quitOrEnd();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAnswer, inputLocked, stepBreakdown, onOpenHint, quitOrEnd]);

  const resolved = phase === 'resolved' && feedbackTone === 'correct';
  const struck =
    (assist || resolved) && stepBreakdown
      ? stepBreakdown.castingOutNines.cancelledDigits
      : [];

  const digitSize =
    currentNumber.length > 8
      ? 'text-[clamp(1.75rem,9vw,2.5rem)]'
      : 'text-[clamp(2.5rem,13vw,3.75rem)]';

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-end justify-between border-b border-rule pb-2">
        {mode === 'sprint' ? (
          <div>
            <span className="label">Solved</span>
            <div className="font-num text-2xl font-bold tnum text-chalk">
              {solvedCount}
              <span className="text-dim">/{settings.sprintTarget}</span>
            </div>
          </div>
        ) : mode === 'survival' ? (
          <div>
            <span className="label">Lives</span>
            <div className="mt-1 flex gap-1.5" aria-label={`${lives} lives left`}>
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`block h-3 w-3 border ${
                    i <= lives ? 'border-chalk bg-chalk' : 'border-rule'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <span className="label">Score</span>
            <div className="font-num text-2xl font-bold tnum text-chalk">{score}</div>
          </div>
        )}

        <div className="text-center">
          {mode === 'timed' && (
            <>
              <span className="label">Left</span>
              <div
                className={`font-num text-2xl font-bold tnum ${
                  timeRemaining <= 10 ? 'text-strike' : 'text-chalk'
                }`}
              >
                {formatClock(timeRemaining)}
              </div>
            </>
          )}
          {mode === 'sprint' && (
            <>
              <span className="label">Elapsed</span>
              <div className="font-num text-2xl font-bold tnum text-chalk">
                {formatClock(elapsedTime)}
              </div>
            </>
          )}
          {(mode === 'survival' || mode === 'zen') && (
            <>
              <span className="label">Solved</span>
              <div className="font-num text-2xl font-bold tnum text-chalk">
                {solvedCount}
              </div>
            </>
          )}
        </div>

        <div className="text-right">
          <span className="label">Streak</span>
          <div
            className={`font-num text-2xl font-bold tnum ${
              streak > 0 ? 'text-race' : 'text-dim'
            }`}
          >
            {streak}×
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center">
        <div className="pointer-events-none absolute top-[22%] z-20 flex flex-col items-center">
          <AnimatePresence>
            {pops.map((pop) => (
              <motion.span
                key={pop.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -28 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={`font-num text-sm font-bold ${pop.tone}`}
              >
                {pop.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          animate={{ x: shakeOffset(wrongShake) }}
          transition={{ duration: 0.24 }}
          className="w-full"
        >
          <DigitStrip digits={currentNumber} struck={struck} sizeClass={digitSize} />
        </motion.div>

        <div className="mt-3 h-14 w-full">
          <RootLine root={resolved ? targetRoot : null} sizeClass="text-3xl" />
        </div>

        <p className={`h-5 text-xs ${FEEDBACK_TONE[feedbackTone]}`} role="status">
          {feedback}
        </p>

        <button
          onClick={() => setAssist(!assist)}
          aria-pressed={assist}
          className={`label mt-3 border-b transition-colors ${
            assist ? 'border-race text-race' : 'border-rule hover:text-chalk'
          }`}
        >
          {assist ? 'Hide casts' : 'Show casts'}
        </button>
      </div>

      <div className="shrink-0 space-y-1.5 pt-3">
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAnswer(num)}
              className={`${KEY_CLASS} py-3.5`}
            >
              {num}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={quitOrEnd}
            className="label rounded-sharp border border-rule py-3 transition-colors hover:text-strike"
          >
            {mode === 'zen' ? 'End' : 'Quit'}
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleAnswer(0)}
            className={`${KEY_CLASS} py-3`}
          >
            0
          </motion.button>
          <button
            onClick={() => stepBreakdown && onOpenHint(stepBreakdown)}
            className="label rounded-sharp border border-rule py-3 transition-colors hover:text-race"
          >
            Hint
          </button>
        </div>
      </div>
    </div>
  );
};
