import React from 'react';
import { BookOpen, X, Sparkles, Check, Zap } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center p-4 z-50">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-left">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-sky-300 font-bold text-base">
            <BookOpen size={20} />
            <span>How to Play & Math Secrets</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Core Rule */}
        <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1.5 backdrop-blur-md">
            <h4 className="font-extrabold text-white text-sm flex items-center space-x-1">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              <span>The Core Rule</span>
            </h4>
            <p className="text-slate-300 text-xs">
              Add all digits of a given number together. If the sum has 2 or more digits, add them again repeatedly until you arrive at a single digit (<strong>0 to 9</strong>).
            </p>
          </div>

          {/* Standard Example */}
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 font-mono text-xs space-y-1 backdrop-blur-md">
            <div className="text-amber-300 font-bold">Standard Example: 36383</div>
            <div className="text-slate-300">Step 1: 3 + 6 + 3 + 8 + 3 = 23</div>
            <div className="text-slate-300">Step 2: 2 + 3 = <span className="text-emerald-300 font-bold text-sm">5</span></div>
          </div>

          {/* Vedic Math Shortcut: Casting Out Nines */}
          <div className="border-t border-white/10 pt-3 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Pro Secret: "Casting Out Nines"</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              In modular arithmetic (mod 9), <strong>9 acts as zero</strong>. You can instantly cross out any digit <strong>9</strong>, <strong>0</strong>, or pairs of digits that add up to <strong>9</strong>!
            </p>

            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-400/20 font-mono text-xs space-y-1.5 backdrop-blur-md">
              <div className="text-amber-200 font-bold">Fast Example: 36383</div>
              <div className="text-slate-300 text-[11px]">
                1. Notice <span className="text-amber-300 font-bold">3 + 6 = 9</span> &rarr; Cross out 3 & 6!
              </div>
              <div className="text-slate-300 text-[11px]">
                2. Remaining digits: <span className="text-amber-300 font-bold">3 + 8 + 3 = 14</span>
              </div>
              <div className="text-slate-300 text-[11px]">
                3. <span className="text-amber-300 font-bold">1 + 4 = 5</span> &rarr; Same answer instantly!
              </div>
            </div>
          </div>

          {/* Quick Digit Pairs */}
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-1 backdrop-blur-md">
            <div className="font-bold text-sky-300 text-[11px]">Pairs that add to 9 to cast out:</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300 font-mono">
              <div className="flex items-center space-x-1"><Check size={12} className="text-emerald-400" /><span>1 + 8 = 9</span></div>
              <div className="flex items-center space-x-1"><Check size={12} className="text-emerald-400" /><span>2 + 7 = 9</span></div>
              <div className="flex items-center space-x-1"><Check size={12} className="text-emerald-400" /><span>3 + 6 = 9</span></div>
              <div className="flex items-center space-x-1"><Check size={12} className="text-emerald-400" /><span>4 + 5 = 9</span></div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 font-bold text-slate-950 transition text-xs shadow-lg shadow-sky-500/20"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};
