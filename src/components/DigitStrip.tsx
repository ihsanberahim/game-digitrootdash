import React, { useRef } from 'react';
import { motion } from 'motion/react';

interface DigitStripProps {
  digits: string;
  /** Indices of digits already cast out. */
  struck?: number[];
  /** Tailwind text-size classes; the strike scales with the type. */
  sizeClass?: string;
  className?: string;
}

/** Digits with cast-out strikes; strike geometry is in em for reuse. */
export const DigitStrip: React.FC<DigitStripProps> = ({
  digits,
  struck = [],
  sizeClass = 'text-5xl',
  className = '',
}) => {
  const spokenDigits = digits.split('').join(' ');
  const castDigits = struck.map((index) => digits[index]).filter(Boolean);
  const label =
    castDigits.length > 0
      ? `${spokenDigits}. Cast out ${castDigits.join(', ')}`
      : spokenDigits;

  return (
    <div
      className={`flex flex-wrap items-center justify-center font-num font-bold tnum ${sizeClass} ${className}`}
      aria-label={label}
    >
      {digits.split('').map((digit, idx) => {
        const isStruck = struck.includes(idx);
        return (
          <span
            key={`${idx}-${digit}`}
            aria-hidden="true"
            className="relative inline-block px-[0.07em]"
          >
            <span
              className={`transition-colors duration-200 ${
                isStruck ? 'text-dim' : 'text-chalk'
              }`}
            >
              {digit}
            </span>
            {/* Rotation on the wrapper keeps the strike drawing left to right. */}
            <span
              aria-hidden
              style={{ height: '0.075em', rotate: '-6deg' }}
              className="pointer-events-none absolute inset-x-[0.04em] top-[46%] block"
            >
              <motion.span
                initial={false}
                animate={{ scaleX: isStruck ? 1 : 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="block h-full w-full origin-left bg-strike"
              />
            </span>
          </span>
        );
      })}
    </div>
  );
};

interface RootLineProps {
  root: number | null;
  sizeClass?: string;
}

export const RootLine: React.FC<RootLineProps> = ({ root, sizeClass = 'text-4xl' }) => {
  // Hold the last root so the digit fades out as itself, not as a stray zero.
  const lastRoot = useRef(root);
  if (root !== null) lastRoot.current = root;

  return (
    <div className="flex w-full flex-col items-center">
      <motion.div
        initial={false}
        animate={{ scaleX: root === null ? 0 : 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="h-px w-24 origin-center bg-rule"
      />
      <motion.span
        initial={false}
        animate={{
          opacity: root === null ? 0 : 1,
          y: root === null ? -6 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`font-num font-bold tnum text-alive ${sizeClass}`}
      >
        {lastRoot.current ?? ''}
      </motion.span>
    </div>
  );
};
