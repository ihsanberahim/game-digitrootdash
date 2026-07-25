import React, { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { computeDigitalRoot, generateRandomNumber, getCancellationGroups } from '../utils/math';
import { DigitStrip, RootLine } from './DigitStrip';

const STRIKE_MS = 850;
const HOLD_MS = 1600;

/** Picks a number that actually demonstrates a cancellation. */
function pickDemoNumber(): string {
  for (let attempt = 0; attempt < 12; attempt++) {
    const candidate = generateRandomNumber(5);
    if (getCancellationGroups(candidate).groups.length > 0) return candidate;
  }
  return '48351';
}

/** Menu thesis: a number losing its nines one strike at a time. */
export const CollapseDemo: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [num, setNum] = useState(pickDemoNumber);
  const [step, setStep] = useState(0);

  const { groups, remainingDigits, remainingSum } = useMemo(
    () => getCancellationGroups(num),
    [num],
  );
  const root = computeDigitalRoot(num);
  const done = step >= groups.length;
  const struck = useMemo(
    () => groups.slice(0, step).flatMap((g) => g.indices),
    [groups, step],
  );

  useEffect(() => {
    if (reduceMotion) {
      setStep(groups.length);
      return;
    }

    const timer = setTimeout(
      () => {
        if (done) {
          setNum(pickDemoNumber());
          setStep(0);
        } else {
          setStep((prev) => prev + 1);
        }
      },
      done ? HOLD_MS : STRIKE_MS,
    );
    return () => clearTimeout(timer);
  }, [done, groups.length, num, step, reduceMotion]);

  let caption = groups[step]?.label ?? 'find the nines';
  if (done) {
    caption =
      remainingDigits.length === 0
        ? 'everything cast out — the root is 9'
        : `${remainingDigits.join(' + ')} = ${remainingSum}${
            remainingSum === root ? '' : ` → ${root}`
          }`;
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <DigitStrip
        digits={num}
        struck={struck}
        sizeClass="text-[clamp(3rem,19vw,5rem)]"
      />
      <RootLine root={done ? root : null} sizeClass="text-4xl" />
      <p className="h-4 text-center font-num text-[11px] tracking-wide text-dim">
        {caption}
      </p>
    </div>
  );
};
