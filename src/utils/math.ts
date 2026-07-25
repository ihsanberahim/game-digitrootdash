import { CancelGroup, GameDifficulty, StepBreakdown } from '../types';

function parseDigits(numStr: string): number[] {
  return numStr.split('').map((d) => parseInt(d, 10));
}

function sumDigits(digits: number[]): number {
  return digits.reduce((acc, n) => acc + n, 0);
}

/** Digits in [min, min + span). */
function randomDigitCount(min: number, span: number): number {
  return min + Math.floor(Math.random() * span);
}

const DIFFICULTY_LENGTH: Record<GameDifficulty, [number, number]> = {
  easy: [2, 2],
  medium: [4, 2],
  hard: [6, 3],
  master: [9, 4],
};

/**
 * Computes the digital root of a number string iteratively.
 */
export function computeDigitalRoot(numStr: string): number {
  let current = numStr;
  while (current.length > 1) {
    current = sumDigits(parseDigits(current)).toString();
  }
  return parseInt(current, 10);
}

/**
 * Generates a full step-by-step breakdown including standard addition
 * and the "Casting out 9s" shortcut technique.
 */
export function getStepByStepBreakdown(numStr: string): StepBreakdown {
  const steps: Array<{ expression: string; sum: number }> = [];
  let current = numStr;

  while (current.length > 1) {
    const digits = parseDigits(current);
    const sum = sumDigits(digits);
    steps.push({ expression: digits.join(' + '), sum });
    current = sum.toString();
  }

  const digitalRoot = parseInt(current, 10);
  const { groups, cancelledDigits, remainingDigits, remainingSum } =
    getCancellationGroups(numStr);

  return {
    original: numStr,
    steps,
    digitalRoot,
    castingOutNines: {
      cancelledDigits,
      groups,
      remainingDigits,
      remainingSum,
      finalRoot: digitalRoot,
    },
  };
}

/**
 * Orders the "casting out nines" cancellations the way a player performs them:
 * lone 9s, then 0s, then pairs that sum to 9. Each group is one strike.
 */
export function getCancellationGroups(numStr: string): {
  groups: CancelGroup[];
  cancelledDigits: number[];
  remainingDigits: number[];
  remainingSum: number;
} {
  const digits = parseDigits(numStr);
  const used = new Array(digits.length).fill(false);
  const groups: CancelGroup[] = [];

  digits.forEach((val, i) => {
    if (val === 9) {
      used[i] = true;
      groups.push({ indices: [i], kind: 'nine', label: '9 counts as nothing' });
    }
  });

  digits.forEach((val, i) => {
    if (val === 0 && !used[i]) {
      used[i] = true;
      groups.push({ indices: [i], kind: 'zero', label: '0 adds nothing' });
    }
  });

  for (let i = 0; i < digits.length; i++) {
    if (used[i]) continue;
    for (let j = i + 1; j < digits.length; j++) {
      if (used[j]) continue;
      if (digits[i] + digits[j] === 9) {
        used[i] = true;
        used[j] = true;
        groups.push({
          indices: [i, j],
          kind: 'pair',
          label: `${digits[i]} + ${digits[j]} = 9`,
        });
        break;
      }
    }
  }

  const cancelledDigits = groups.flatMap((g) => g.indices);
  const remainingDigits = digits.filter((_, i) => !used[i]);

  return {
    groups,
    cancelledDigits,
    remainingDigits,
    remainingSum: sumDigits(remainingDigits),
  };
}

/**
 * Generates a random multi-digit number string based on target length.
 */
export function generateRandomNumber(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const digit =
      i === 0
        ? Math.floor(Math.random() * 9) + 1
        : Math.floor(Math.random() * 10);
    result += digit.toString();
  }
  return result;
}

/**
 * Digit count from fixed difficulty, or adaptive length for timed / survival.
 */
export function getDigitCountForProgression(
  solvedCount: number,
  difficulty: string,
): number {
  const fixed = DIFFICULTY_LENGTH[difficulty as GameDifficulty];
  if (fixed) return randomDigitCount(fixed[0], fixed[1]);

  if (solvedCount >= 25) return randomDigitCount(7, 3);
  if (solvedCount >= 15) return randomDigitCount(5, 2);
  if (solvedCount >= 8) return randomDigitCount(4, 2);
  if (solvedCount >= 3) return randomDigitCount(3, 2);
  return randomDigitCount(2, 2);
}
