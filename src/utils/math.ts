import { StepBreakdown } from '../types';

/**
 * Computes the digital root of a number string iteratively.
 */
export function computeDigitalRoot(numStr: string): number {
  let current = numStr;
  while (current.length > 1) {
    let sum = 0;
    for (let i = 0; i < current.length; i++) {
      sum += parseInt(current[i], 10);
    }
    current = sum.toString();
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
    const digits = current.split('').map(d => parseInt(d, 10));
    const sum = digits.reduce((acc, curr) => acc + curr, 0);
    const expression = digits.join(' + ');
    steps.push({ expression, sum });
    current = sum.toString();
  }

  const digitalRoot = parseInt(current, 10);

  // Casting out nines logic
  const digits = numStr.split('').map((d, idx) => ({ val: parseInt(d, 10), idx }));
  const used = new Array(digits.length).fill(false);
  const cancelledIndices: number[] = [];

  // 1. Cancel exact 9s
  digits.forEach((d, i) => {
    if (d.val === 9) {
      used[i] = true;
      cancelledIndices.push(i);
    }
  });

  // 2. Cancel exact 0s (they add nothing)
  digits.forEach((d, i) => {
    if (d.val === 0 && !used[i]) {
      used[i] = true;
      cancelledIndices.push(i);
    }
  });

  // 3. Cancel pairs summing to 9
  for (let i = 0; i < digits.length; i++) {
    if (used[i]) continue;
    for (let j = i + 1; j < digits.length; j++) {
      if (used[j]) continue;
      if (digits[i].val + digits[j].val === 9) {
        used[i] = true;
        used[j] = true;
        cancelledIndices.push(i);
        cancelledIndices.push(j);
        break;
      }
    }
  }

  // Remaining digits
  const remainingDigits = digits.filter((_, i) => !used[i]).map(d => d.val);
  const remainingSum = remainingDigits.reduce((a, b) => a + b, 0);
  const finalRoot = remainingSum === 0 ? 9 : (remainingSum % 9 === 0 ? 9 : remainingSum % 9);

  return {
    original: numStr,
    steps,
    digitalRoot,
    castingOutNines: {
      cancelledDigits: cancelledIndices,
      remainingDigits,
      remainingSum,
      finalRoot: numStr === '0' ? 0 : (finalRoot === 9 && digitalRoot === 0 ? 0 : digitalRoot)
    }
  };
}

/**
 * Generates a random multi-digit number string based on target length or difficulty.
 */
export function generateRandomNumber(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    // First digit is non-zero (1-9)
    const digit = i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
    result += digit.toString();
  }
  return result;
}

/**
 * Calculates digit count based on game difficulty or progression.
 */
export function getDigitCountForProgression(solvedCount: number, difficulty: string): number {
  if (difficulty === 'easy') return 2 + Math.floor(Math.random() * 2); // 2-3
  if (difficulty === 'medium') return 4 + Math.floor(Math.random() * 2); // 4-5
  if (difficulty === 'hard') return 6 + Math.floor(Math.random() * 3); // 6-8
  if (difficulty === 'master') return 9 + Math.floor(Math.random() * 4); // 9-12

  // Adaptive scaling for timed / survival
  if (solvedCount >= 25) return 7 + Math.floor(Math.random() * 3); // 7-9 digits
  if (solvedCount >= 15) return 5 + Math.floor(Math.random() * 2); // 5-6 digits
  if (solvedCount >= 8) return 4 + Math.floor(Math.random() * 2); // 4-5 digits
  if (solvedCount >= 3) return 3 + Math.floor(Math.random() * 2); // 3-4 digits
  return 2 + Math.floor(Math.random() * 2); // 2-3 digits
}
