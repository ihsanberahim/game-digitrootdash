import React from 'react';
import { DigitStrip, RootLine } from './DigitStrip';
import { Sheet, SheetButton } from './Sheet';

interface RulesModalProps {
  onClose: () => void;
}

const PAIRS = ['1 + 8', '2 + 7', '3 + 6', '4 + 5'];

const CONTROLS: Array<[string, string]> = [
  ['0 – 9', 'Answer'],
  ['H', 'Hint'],
  ['Esc', 'Quit run'],
];

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => (
  <Sheet
    title="How to play"
    onClose={onClose}
    footer={
      <SheetButton variant="primary" onClick={onClose}>
        Done
      </SheetButton>
    }
  >
    <section>
      <span className="label">The rule</span>
      <p className="mt-2 text-sm leading-relaxed text-chalk">
        Add every digit of the number. If the total still has two digits, add again.
        Keep going until one digit is left — that is the digit root.
      </p>
      <div className="mt-3 border-y border-rule py-2 font-num text-xs text-dim">
        <div>3 + 6 + 3 + 8 + 3 = 23</div>
        <div>
          2 + 3 = <span className="font-bold text-chalk">5</span>
        </div>
      </div>
    </section>

    <section className="mt-6">
      <span className="label">The shortcut — cast out nines</span>
      <p className="mt-2 text-sm leading-relaxed text-chalk">
        Nine behaves like zero here. Strike out every 9, every 0, and every pair
        that adds to 9. Add whatever survives.
      </p>

      <div className="mt-4">
        <DigitStrip digits="36383" struck={[0, 1]} sizeClass="text-4xl" />
        <div className="mt-2">
          <RootLine root={5} sizeClass="text-2xl" />
        </div>
        <p className="mt-2 text-center text-xs text-dim">
          3 + 6 = 9, struck. 3 + 8 + 3 = 14, and 1 + 4 = 5.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PAIRS.map((pair) => (
          <span
            key={pair}
            className="rounded-sharp border border-rule px-2 py-1 font-num text-xs text-chalk"
          >
            {pair}
          </span>
        ))}
      </div>
    </section>

    <section className="mt-6">
      <span className="label">Keys</span>
      <dl className="mt-2 divide-y divide-rule border-y border-rule">
        {CONTROLS.map(([key, action]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <dt className="font-num text-xs text-chalk">{key}</dt>
            <dd className="text-xs text-dim">{action}</dd>
          </div>
        ))}
      </dl>
    </section>
  </Sheet>
);
