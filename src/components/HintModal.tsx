import React from 'react';
import { StepBreakdown } from '../types';
import { DigitStrip, RootLine } from './DigitStrip';
import { Sheet, SheetButton } from './Sheet';

interface HintModalProps {
  breakdown: StepBreakdown | null;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ breakdown, onClose }) => {
  if (!breakdown) return null;

  const { original, steps, digitalRoot, castingOutNines } = breakdown;
  const { groups, remainingDigits, remainingSum, cancelledDigits } = castingOutNines;

  const remainingLabel =
    remainingDigits.length > 0
      ? `${remainingDigits.join(' + ')} = ${remainingSum}${
          remainingSum === digitalRoot ? '' : ` → ${digitalRoot}`
        }`
      : 'Nothing left standing';

  return (
    <Sheet
      title="The casts"
      onClose={onClose}
      footer={
        <SheetButton variant="primary" onClick={onClose}>
          Back to the board
        </SheetButton>
      }
    >
      <DigitStrip
        digits={original}
        struck={cancelledDigits}
        sizeClass="text-[clamp(1.75rem,10vw,2.75rem)]"
      />
      <div className="mt-3">
        <RootLine root={digitalRoot} sizeClass="text-3xl" />
      </div>

      <ul className="mt-5 divide-y divide-rule border-y border-rule">
        {groups.map((group, idx) => (
          <li key={idx} className="flex items-center justify-between py-2">
            <span className="text-sm text-chalk">{group.label}</span>
            <span className="label">cast out</span>
          </li>
        ))}
        <li className="flex items-center justify-between py-2">
          <span className="text-sm text-chalk">{remainingLabel}</span>
          <span className="font-num text-sm font-bold text-alive">{digitalRoot}</span>
        </li>
      </ul>

      <section className="mt-5">
        <span className="label">The long way</span>
        <ol className="mt-2 space-y-1">
          {steps.map((step, idx) => (
            <li key={idx} className="font-num text-xs text-dim">
              {step.expression} ={' '}
              <span className="font-bold text-chalk">{step.sum}</span>
            </li>
          ))}
        </ol>
      </section>
    </Sheet>
  );
};
