import React from 'react';
import { Lightbulb, X, Sparkles, ArrowRight } from 'lucide-react';
import { StepBreakdown } from '../types';

interface HintModalProps {
  breakdown: StepBreakdown | null;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ breakdown, onClose }) => {
  if (!breakdown) return null;

  const { original, steps, digitalRoot, castingOutNines } = breakdown;

  return (
    <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
            <Lightbulb size={20} />
            <span>Step-by-Step Hint</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Number Title */}
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center backdrop-blur-md">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold block">
            Target Number
          </span>
          <span className="text-3xl font-black text-sky-300 font-mono tracking-wider">{original}</span>
        </div>

        {/* Method 1: Standard Addition */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Method 1: Sequential Addition
          </span>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 font-mono text-xs space-y-2 text-slate-300 backdrop-blur-md">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-white/10 pb-1.5 last:border-none last:pb-0">
                <span className="text-slate-400">Step {idx + 1}:</span>
                <span>{step.expression} = <strong className="text-emerald-300 font-bold">{step.sum}</strong></span>
              </div>
            ))}
            <div className="pt-1 text-right font-extrabold text-sky-300 text-sm">
              Final Answer: {digitalRoot}
            </div>
          </div>
        </div>

        {/* Method 2: Casting Out Nines Shortcut */}
        <div className="space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-center space-x-1 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Vedic Shortcut: "Casting Out 9s"</span>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-400/20 text-xs space-y-2 text-slate-300 backdrop-blur-md">
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Ignore any <strong>9</strong>s, <strong>0</strong>s, or pairs that add up to <strong>9</strong> (e.g. 1+8, 2+7, 3+6, 4+5):
            </p>

            <div className="font-mono flex flex-wrap gap-1 py-1">
              {original.split('').map((digit, idx) => {
                const isCancelled = castingOutNines.cancelledDigits.includes(idx);
                return (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-sm ${
                      isCancelled
                        ? 'line-through text-slate-500 bg-black/40'
                        : 'text-amber-200 font-bold bg-amber-500/20 border border-amber-400/40'
                    }`}
                  >
                    {digit}
                  </span>
                );
              })}
            </div>

            {castingOutNines.remainingDigits.length > 0 ? (
              <div className="font-mono text-xs text-amber-200">
                Remaining sum: {castingOutNines.remainingDigits.join(' + ')} = {castingOutNines.remainingSum}{' '}
                <ArrowRight size={12} className="inline mx-1" />
                <strong className="text-emerald-300 text-sm">{castingOutNines.finalRoot}</strong>
              </div>
            ) : (
              <div className="font-mono text-xs text-amber-200">
                All digits cast out! <ArrowRight size={12} className="inline mx-1" /> Answer is <strong className="text-emerald-300 text-sm">9</strong>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 font-bold text-slate-950 transition text-sm shadow-lg shadow-sky-500/20"
        >
          Got It, Resume Game!
        </button>
      </div>
    </div>
  );
};
